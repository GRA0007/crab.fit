//! `SeaORM` Entity. Generated by sea-orm-codegen 0.11.3

use chrono::{DateTime as ChronoDateTime, Utc};
use data::person::Person;
use sea_orm::entity::prelude::*;

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq)]
#[sea_orm(table_name = "person")]
pub struct Model {
    #[sea_orm(primary_key, auto_increment = false)]
    pub name: String,
    pub password_hash: Option<String>,
    pub created_at: DateTime,
    pub availability: Json,
    #[sea_orm(primary_key, auto_increment = false)]
    pub event_id: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(
        belongs_to = "super::event::Entity",
        from = "Column::EventId",
        to = "super::event::Column::Id",
        on_update = "Cascade",
        on_delete = "Cascade"
    )]
    Event,
}

impl Related<super::event::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Event.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}

impl From<Model> for Person {
    fn from(value: Model) -> Self {
        Self {
            name: value.name,
            password_hash: value.password_hash,
            created_at: ChronoDateTime::<Utc>::from_utc(value.created_at, Utc),
            availability: serde_json::from_value(value.availability).unwrap_or(vec![]),
        }
    }
}