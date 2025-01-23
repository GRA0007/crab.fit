use std::{env, error::Error};

use async_trait::async_trait;
use chrono::{DateTime, Utc};
use common::{Adaptor, Event, Person, Stats};
use entity::{event, person, stats};
use migration::{Migrator, MigratorTrait};
use sea_orm::{
    strum::Display,
    ActiveModelTrait,
    ActiveValue::{NotSet, Set},
    ColumnTrait, Database, DatabaseConnection, DbErr, EntityTrait, ModelTrait, QueryFilter,
    TransactionError, TransactionTrait, TryIntoModel,
};
use serde_json::json;

mod entity;
mod migration;

pub struct SqlAdaptor {
    db: DatabaseConnection,
}

#[async_trait]
impl Adaptor for SqlAdaptor {
    type Error = SqlAdaptorError;

    async fn get_stats(&self) -> Result<Stats, Self::Error> {
        let stats_row = get_stats_row(&self.db).await?;
        Ok(Stats {
            event_count: stats_row.event_count.unwrap() as i64,
            person_count: stats_row.person_count.unwrap() as i64,
        })
    }

    async fn increment_stat_event_count(&self) -> Result<i64, Self::Error> {
        let mut current_stats = get_stats_row(&self.db).await?;
        current_stats.event_count = Set(current_stats.event_count.unwrap() + 1);

        Ok(current_stats.save(&self.db).await?.event_count.unwrap() as i64)
    }

    async fn increment_stat_person_count(&self) -> Result<i64, Self::Error> {
        let mut current_stats = get_stats_row(&self.db).await?;
        current_stats.person_count = Set(current_stats.person_count.unwrap() + 1);

        Ok(current_stats.save(&self.db).await?.person_count.unwrap() as i64)
    }

    async fn get_people(&self, event_id: String) -> Result<Option<Vec<Person>>, Self::Error> {
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
    ) -> Result<Option<Person>, Self::Error> {
        let data = person::ActiveModel {
            name: Set(person.name.clone()),
            password_hash: Set(person.password_hash),
            created_at: Set(person.created_at.naive_utc()),
            availability: Set(serde_json::to_value(person.availability).unwrap_or(json!([]))),
            event_id: Set(event_id.clone()),
        };

        // Check if the event exists
        if event::Entity::find_by_id(event_id.clone())
            .one(&self.db)
            .await?
            .is_none()
        {
            return Ok(None);
        }

        Ok(Some(
            match person::Entity::find_by_id((person.name, event_id))
                .one(&self.db)
                .await?
            {
                Some(_) => data.update(&self.db).await?.try_into_model()?.into(),
                None => data.insert(&self.db).await?.try_into_model()?.into(),
            },
        ))
    }

    async fn get_event(&self, id: String) -> Result<Option<Event>, Self::Error> {
        let existing_event = event::Entity::find_by_id(id).one(&self.db).await?;

        // Mark as visited
        if let Some(event) = existing_event.clone() {
            let mut event: event::ActiveModel = event.into();
            event.visited_at = Set(Utc::now().naive_utc());
            event.save(&self.db).await?;
        }

        Ok(existing_event.map(|model| model.into()))
    }

    async fn create_event(&self, event: Event) -> Result<Event, Self::Error> {
        Ok(event::ActiveModel {
            id: Set(event.id),
            name: Set(event.name),
            created_at: Set(event.created_at.naive_utc()),
            visited_at: Set(event.visited_at.naive_utc()),
            times: Set(serde_json::to_value(event.times).unwrap_or(json!([]))),
            timezone: Set(event.timezone),
        }
        .insert(&self.db)
        .await?
        .try_into_model()?
        .into())
    }

    async fn delete_events(&self, cutoff: DateTime<Utc>) -> Result<Stats, Self::Error> {
        let (event_count, person_count) = self
            .db
            .transaction::<_, (i64, i64), DbErr>(|t| {
                Box::pin(async move {
                    // Get events older than the cutoff date
                    let old_events = event::Entity::find()
                        .filter(event::Column::VisitedAt.lt(cutoff.naive_utc()))
                        .all(t)
                        .await?;

                    // Delete people
                    let mut people_deleted: i64 = 0;
                    // TODO: run concurrently
                    for e in old_events.iter() {
                        let people_delete_result = person::Entity::delete_many()
                            .filter(person::Column::EventId.eq(&e.id))
                            .exec(t)
                            .await?;
                        people_deleted += people_delete_result.rows_affected as i64;
                    }

                    // Delete events
                    let event_delete_result = event::Entity::delete_many()
                        .filter(event::Column::VisitedAt.lt(cutoff.naive_utc()))
                        .exec(t)
                        .await?;

                    Ok((event_delete_result.rows_affected as i64, people_deleted))
                })
            })
            .await?;

        Ok(Stats {
            event_count,
            person_count,
        })
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

impl SqlAdaptor {
    pub async fn new() -> Self {
        let connection_string =
            env::var("DATABASE_URL").expect("Expected DATABASE_URL environment variable");

        // Connect to the database
        let db = Database::connect(&connection_string)
            .await
            .expect("Failed to connect to SQL database");
        println!(
            "{} Connected to database at {}",
            match db {
                DatabaseConnection::SqlxMySqlPoolConnection(_) => "🐬",
                DatabaseConnection::SqlxPostgresPoolConnection(_) => "🐘",
                DatabaseConnection::SqlxSqlitePoolConnection(_) => "🪶",
                DatabaseConnection::Disconnected => panic!("Failed to connect to SQL database"),
            },
            connection_string
        );

        // Setup tables
        Migrator::up(&db, None)
            .await
            .expect("Failed to set up tables in the database");

        Self { db }
    }
}

impl From<event::Model> for Event {
    fn from(value: event::Model) -> Self {
        Self {
            id: value.id,
            name: value.name,
            created_at: DateTime::from_naive_utc_and_offset(value.created_at, Utc),
            visited_at: DateTime::from_naive_utc_and_offset(value.visited_at, Utc),
            times: serde_json::from_value(value.times).unwrap_or(vec![]),
            timezone: value.timezone,
        }
    }
}

impl From<person::Model> for Person {
    fn from(value: person::Model) -> Self {
        Self {
            name: value.name,
            password_hash: value.password_hash,
            created_at: DateTime::from_naive_utc_and_offset(value.created_at, Utc),
            availability: serde_json::from_value(value.availability).unwrap_or(vec![]),
        }
    }
}

#[derive(Display, Debug)]
pub enum SqlAdaptorError {
    DbErr(DbErr),
    TransactionError(TransactionError<DbErr>),
}

impl Error for SqlAdaptorError {}

impl From<DbErr> for SqlAdaptorError {
    fn from(value: DbErr) -> Self {
        Self::DbErr(value)
    }
}
impl From<TransactionError<DbErr>> for SqlAdaptorError {
    fn from(value: TransactionError<DbErr>) -> Self {
        Self::TransactionError(value)
    }
}
