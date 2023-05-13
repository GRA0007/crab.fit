use axum::{
    extract::{self, Path},
    Json,
};
use common::{adaptor::Adaptor, person::Person};

use crate::{
    errors::ApiError,
    payloads::{ApiResult, PersonResponse, UpdatePersonInput},
    State,
};

use super::get_person::verify_password;

#[utoipa::path(
    patch,
    path = "/event/{event_id}/people/{person_name}",
    params(
        ("event_id", description = "The ID of the event"),
        ("person_name", description = "The name of the person"),
    ),
    request_body(content = UpdatePersonInput, description = "Person details"),
    responses(
        (status = 200, description = "Ok", body = PersonResponse),
        (status = 401, description = "Incorrect password"),
        (status = 404, description = "Event or person not found"),
        (status = 415, description = "Unsupported input format"),
        (status = 422, description = "Invalid input provided"),
        (status = 429, description = "Too many requests"),
    ),
    tag = "person",
)]
/// Update a person's availabilities
pub async fn update_person<A: Adaptor>(
    extract::State(state): State<A>,
    Path((event_id, person_name)): Path<(String, String)>,
    Json(input): Json<UpdatePersonInput>,
) -> ApiResult<PersonResponse, A> {
    let adaptor = &state.lock().await.adaptor;

    let existing_people = adaptor
        .get_people(event_id.clone())
        .await
        .map_err(ApiError::AdaptorError)?;

    // Event not found
    if existing_people.is_none() {
        return Err(ApiError::NotFound);
    }

    // Check if the user exists
    let existing_person = existing_people
        .unwrap()
        .into_iter()
        .find(|p| p.name == person_name)
        .ok_or(ApiError::NotFound)?;

    // Verify password (if set)
    if !verify_password(&existing_person, input.password) {
        return Err(ApiError::NotAuthorized);
    }

    Ok(Json(
        adaptor
            .upsert_person(
                event_id,
                Person {
                    name: existing_person.name,
                    password_hash: existing_person.password_hash,
                    created_at: existing_person.created_at,
                    availability: input.availability,
                },
            )
            .await
            .map_err(ApiError::AdaptorError)?
            .into(),
    ))
}
