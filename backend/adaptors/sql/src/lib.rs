use std::{env, error::Error};

use async_trait::async_trait;
use data::{
    adaptor::Adaptor,
    event::{Event, EventDeletion},
    person::Person,
    stats::Stats,
};
use entity::{event, person, stats};
use migration::{Migrator, MigratorTrait};
use sea_orm::{
    ActiveModelTrait,
    ActiveValue::{NotSet, Set},
    ColumnTrait, Database, DatabaseConnection, DbErr, EntityTrait, ModelTrait, QueryFilter,
    TransactionTrait, TryIntoModel,
};
use serde_json::json;

mod entity;
mod migration;

pub struct PostgresAdaptor {
    db: DatabaseConnection,
}

#[async_trait]
impl Adaptor for PostgresAdaptor {
    async fn new() -> Self {
        let connection_string = env::var("DATABASE_URL").unwrap();

        // Connect to the database
        let db = Database::connect(&connection_string).await.unwrap();
        println!("Connected to database at {}", connection_string);

        // Setup tables
        Migrator::up(&db, None).await.unwrap();

        Self { db }
    }

    async fn get_stats(&self) -> Result<Stats, Box<dyn Error>> {
        Ok(get_stats_row(&self.db).await?.try_into_model()?.into())
    }

    async fn increment_stat_event_count(&self) -> Result<i32, Box<dyn Error>> {
        let mut current_stats = get_stats_row(&self.db).await?;
        current_stats.event_count = Set(current_stats.event_count.unwrap() + 1);

        Ok(current_stats.save(&self.db).await?.event_count.unwrap())
    }

    async fn increment_stat_person_count(&self) -> Result<i32, Box<dyn Error>> {
        let mut current_stats = get_stats_row(&self.db).await?;
        current_stats.person_count = Set(current_stats.person_count.unwrap() + 1);

        Ok(current_stats.save(&self.db).await?.person_count.unwrap())
    }

    async fn get_people(&self, event_id: String) -> Result<Option<Vec<Person>>, Box<dyn Error>> {
        // TODO: optimize into one query
        let event_row = event::Entity::find_by_id(event_id).one(&self.db).await?;

        Ok(match event_row {
            Some(event) => Some(
                event
                    .find_related(person::Entity)
                    .all(&self.db)
                    .await?
                    .into_iter()
                    .map(|model| model.into())
                    .collect(),
            ),
            None => None,
        })
    }

    async fn upsert_person(
        &self,
        event_id: String,
        person: Person,
    ) -> Result<Person, Box<dyn Error>> {
        Ok(person::ActiveModel {
            name: Set(person.name),
            password_hash: Set(person.password_hash),
            created_at: Set(person.created_at.naive_utc()),
            availability: Set(serde_json::to_value(person.availability).unwrap_or(json!([]))),
            event_id: Set(event_id),
        }
        .save(&self.db)
        .await?
        .try_into_model()?
        .into())
    }

    async fn get_event(&self, id: String) -> Result<Option<Event>, Box<dyn Error>> {
        Ok(event::Entity::find_by_id(id)
            .one(&self.db)
            .await?
            .map(|model| model.into()))
    }

    async fn create_event(&self, event: Event) -> Result<Event, Box<dyn Error>> {
        Ok(event::ActiveModel {
            id: Set(event.id),
            name: Set(event.name),
            created_at: Set(event.created_at.naive_utc()),
            times: Set(serde_json::to_value(event.times).unwrap_or(json!([]))),
            timezone: Set(event.timezone),
        }
        .save(&self.db)
        .await?
        .try_into_model()?
        .into())
    }

    async fn delete_event(&self, id: String) -> Result<EventDeletion, Box<dyn Error>> {
        let event_id = id.clone();
        let person_count = self
            .db
            .transaction::<_, u64, DbErr>(|t| {
                Box::pin(async move {
                    // Delete people
                    let people_delete_result = person::Entity::delete_many()
                        .filter(person::Column::EventId.eq(&event_id))
                        .exec(t)
                        .await?;

                    // Delete event
                    event::Entity::delete_by_id(event_id).exec(t).await?;

                    Ok(people_delete_result.rows_affected)
                })
            })
            .await?;

        Ok(EventDeletion { id, person_count })
    }
}

// Get the current stats as an ActiveModel
async fn get_stats_row(db: &DatabaseConnection) -> Result<stats::ActiveModel, DbErr> {
    let current_stats = stats::Entity::find().one(db).await?;
    Ok(match current_stats {
        Some(model) => model.into(),
        None => stats::ActiveModel {
            id: NotSet,
            event_count: Set(0),
            person_count: Set(0),
        },
    })
}
