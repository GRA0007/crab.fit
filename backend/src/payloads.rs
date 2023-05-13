use axum::Json;
use common::{event::Event, person::Person, stats::Stats};
use serde::{Deserialize, Serialize};

use crate::errors::ApiError;

pub type ApiResult<T, A> = Result<Json<T>, ApiError<A>>;

#[derive(Deserialize)]
pub struct EventInput {
    pub name: Option<String>,
    pub times: Vec<String>,
    pub timezone: String,
}

#[derive(Serialize)]
pub struct EventResponse {
    pub id: String,
    pub name: String,
    pub times: Vec<String>,
    pub timezone: String,
    pub created_at: i64,
}

impl From<Event> for EventResponse {
    fn from(value: Event) -> Self {
        Self {
            id: value.id,
            name: value.name,
            times: value.times,
            timezone: value.timezone,
            created_at: value.created_at.timestamp(),
        }
    }
}

#[derive(Serialize)]
pub struct StatsResponse {
    pub event_count: i32,
    pub person_count: i32,
    pub version: String,
}

impl From<Stats> for StatsResponse {
    fn from(value: Stats) -> Self {
        Self {
            event_count: value.event_count,
            person_count: value.person_count,
            version: env!("CARGO_PKG_VERSION").to_string(),
        }
    }
}

#[derive(Serialize)]
pub struct PersonResponse {
    pub name: String,
    pub availability: Vec<String>,
    pub created_at: i64,
}

impl From<Person> for PersonResponse {
    fn from(value: Person) -> Self {
        Self {
            name: value.name,
            availability: value.availability,
            created_at: value.created_at.timestamp(),
        }
    }
}

#[derive(Deserialize)]
pub struct GetPersonInput {
    pub password: Option<String>,
}

#[derive(Deserialize)]
pub struct UpdatePersonInput {
    pub password: Option<String>,
    pub availability: Vec<String>,
}
