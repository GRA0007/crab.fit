use axum::{extract, Json};
use common::Adaptor;

use crate::{
    errors::ApiError,
    payloads::{ApiResult, StatsResponse},
    State,
};

#[utoipa::path(
    get,
    path = "/stats",
    responses(
        (status = 200, description = "Ok", body = StatsResponse),
        (status = 429, description = "Too many requests"),
    ),
    tag = "info",
)]
/// Get current stats
pub async fn get_stats<A: Adaptor>(extract::State(state): State<A>) -> ApiResult<StatsResponse, A> {
    let adaptor = &state.lock().await.adaptor;

    let stats = adaptor.get_stats().await.map_err(ApiError::AdaptorError)?;

    Ok(Json(stats.into()))
}
