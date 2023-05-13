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
