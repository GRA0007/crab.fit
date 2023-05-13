use axum::{
    extract::{self, Path},
    Json,
};
use common::adaptor::Adaptor;

use crate::{
    errors::ApiError,
    payloads::{ApiResult, PersonResponse},
    State,
};

#[utoipa::path(
    get,
    path = "/event/{event_id}/people",
    params(
        ("event_id", description = "The ID of the event"),
    ),
    responses(
        (status = 200, description = "Ok", body = [PersonResponse]),
        (status = 404, description = "Event not found"),
        (status = 429, description = "Too many requests"),
    ),
    tag = "person",
)]
/// Get availabilities for an event
pub async fn get_people<A: Adaptor>(
    extract::State(state): State<A>,
    Path(event_id): Path<String>,
) -> ApiResult<Vec<PersonResponse>, A> {
    let adaptor = &state.lock().await.adaptor;

    let people = adaptor
        .get_people(event_id)
        .await
        .map_err(ApiError::AdaptorError)?;

    match people {
        Some(people) => Ok(Json(people.into_iter().map(|p| p.into()).collect())),
        None => Err(ApiError::NotFound),
    }
}
