use axum::{http::StatusCode, response::IntoResponse};
use common::adaptor::Adaptor;

pub enum ApiError<A: Adaptor> {
    AdaptorError(A::Error),
    NotFound,
    // NotAuthorized,
}

// Define what the error types above should return
impl<A: Adaptor> IntoResponse for ApiError<A> {
    fn into_response(self) -> axum::response::Response {
        match self {
            ApiError::AdaptorError(e) => {
                tracing::error!(?e);
                StatusCode::INTERNAL_SERVER_ERROR.into_response()
            }
            ApiError::NotFound => StatusCode::NOT_FOUND.into_response(),
            // ApiError::NotAuthorized => StatusCode::UNAUTHORIZED.into_response(),
        }
    }
}
