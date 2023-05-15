use std::env;

use axum::{extract, http::HeaderMap};
use chrono::{Duration, Utc};
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
    security((), ("cron-key" = [])),
    tag = "tasks",
)]
/// Delete events older than 3 months
pub async fn cleanup<A: Adaptor>(
    extract::State(state): State<A>,
    headers: HeaderMap,
) -> Result<(), ApiError<A>> {
    // Check cron key
    let cron_key_header: String = headers
        .get("X-Cron-Key")
        .map(|k| k.to_str().unwrap_or_default().into())
        .unwrap_or_default();
    let env_key = env::var("CRON_KEY").unwrap_or_default();
    if !env_key.is_empty() && cron_key_header != env_key {
        return Err(ApiError::NotAuthorized);
    }

    info!("Running cleanup task");

    let adaptor = &state.lock().await.adaptor;

    let result = adaptor
        .delete_events(Utc::now() - Duration::days(90))
        .await
        .map_err(ApiError::AdaptorError)?;

    info!(
        "Cleanup successful: {} events and {} people removed",
        result.event_count, result.person_count
    );

    Ok(())
}
