use axum::Json;
use common::event::Event;
use serde::{Deserialize, Serialize};

use crate::errors::ApiError;

pub type ApiResult<T, A> = Result<Json<T>, ApiError<A>>;

#[derive(Deserialize)]
pub struct EventInput {
    pub name: String,
    pub times: Vec<String>,
    pub timezone: String,
}

#[derive(Serialize)]
pub struct EventResponse {
    pub id: String,
    pub name: String,
    pub times: Vec<String>,
    pub timezone: String,
    pub created: i64,
}

impl From<Event> for EventResponse {
    fn from(value: Event) -> Self {
        Self {
            id: value.id,
            name: value.name,
            times: value.times,
            timezone: value.timezone,
            created: value.created_at.timestamp(),
        }
    }
}

#[derive(Serialize)]
#[serde(rename_all(serialize = "camelCase"))]
pub struct StatsResponse {
    pub event_count: i32,
    pub person_count: i32,
    pub version: String,
}
