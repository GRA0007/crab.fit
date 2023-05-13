use axum::{extract, Json};
use common::adaptor::Adaptor;

use crate::{
    errors::ApiError,
    payloads::{ApiResult, StatsResponse},
    State,
};

pub async fn get_stats<A: Adaptor>(extract::State(state): State<A>) -> ApiResult<StatsResponse, A> {
    let adaptor = &state.lock().await.adaptor;

    let stats = adaptor.get_stats().await.map_err(ApiError::AdaptorError)?;

    Ok(Json(stats.into()))
}
