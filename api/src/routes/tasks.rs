use std::env;

use axum::{extract, http::HeaderMap};
use common::Adaptor;
use tracing::info;

use crate::{errors::ApiError, State};

#[utoipa::path(
    get,
    path = "/tasks/cleanup",
    responses(
        (status = 200, description = "Cleanup complete"),
        (status = 401, description = "Missing or incorrect X-Cron-Key header"),
        (status = 429, description = "Too many requests"),
    ),
    tag = "tasks",
)]
/// Delete events older than 3 months
pub async fn cleanup<A: Adaptor>(
    extract::State(state): State<A>,
    headers: HeaderMap,
) -> Result<(), ApiError<A>> {
    // Check cron key
    let cron_key = headers.get("X-Cron-Key").ok_or(ApiError::NotAuthorized)?;
    if let Ok(key) = env::var("CRON_KEY") {
        if !key.is_empty() && *cron_key != key {
            return Err(ApiError::NotAuthorized);
        }
    }

    info!("Running cleanup task");

    let adaptor = &state.lock().await.adaptor;

    // TODO:
    //let stats = adaptor.get_stats().await.map_err(ApiError::AdaptorError)?;

    Ok(())
}
