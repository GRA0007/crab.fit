use axum::{
    extract::{self, Path},
    Json,
};
use common::adaptor::Adaptor;

use crate::{
    errors::ApiError,
    payloads::{ApiResult, EventResponse},
    State,
};

pub async fn get_event<A: Adaptor>(
    extract::State(state): State<A>,
    Path(event_id): Path<String>,
) -> ApiResult<EventResponse, A> {
    let adaptor = &state.lock().await.adaptor;

    let event = adaptor
        .get_event(event_id)
        .await
        .map_err(ApiError::AdaptorError)?;

    match event {
        Some(event) => Ok(Json(event.into())),
        None => Err(ApiError::NotFound),
    }
}
