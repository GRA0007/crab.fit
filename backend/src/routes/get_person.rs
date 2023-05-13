use axum::{
    extract::{self, Path},
    Json,
};
use common::{adaptor::Adaptor, person::Person};

use crate::{
    errors::ApiError,
    payloads::{ApiResult, GetPersonInput, PersonResponse},
    State,
};

#[utoipa::path(
    get,
    path = "/event/{event_id}/people/{person_name}",
    params(
        ("event_id", description = "The ID of the event"),
        ("person_name", description = "The name of the person"),
    ),
    request_body(content = GetPersonInput, description = "Person details"),
    responses(
        (status = 200, description = "Ok", body = PersonResponse),
        (status = 401, description = "Incorrect password"),
        (status = 404, description = "Event not found"),
        (status = 415, description = "Unsupported input format"),
        (status = 422, description = "Invalid input provided"),
        (status = 429, description = "Too many requests"),
    ),
    tag = "person",
)]
/// Login or create a person for an event
pub async fn get_person<A: Adaptor>(
    extract::State(state): State<A>,
    Path((event_id, person_name)): Path<(String, String)>,
    input: Option<Json<GetPersonInput>>,
) -> ApiResult<PersonResponse, A> {
    let adaptor = &state.lock().await.adaptor;

    // Get inputted password
    let password = match input {
        Some(Json(i)) => i.password,
        None => None,
    };

    let existing_people = adaptor
        .get_people(event_id.clone())
        .await
        .map_err(ApiError::AdaptorError)?;

    // Event not found
    if existing_people.is_none() {
        return Err(ApiError::NotFound);
    }

    // Check if the user already exists
    let existing_person = existing_people
        .unwrap()
        .into_iter()
        .find(|p| p.name == person_name);

    match existing_person {
        // Login
        Some(p) => {
            // Verify password (if set)
            if verify_password(&p, password) {
                Ok(Json(p.into()))
            } else {
                Err(ApiError::NotAuthorized)
            }
        }
        // Signup
        None => {
            // Update stats
            adaptor
                .increment_stat_person_count()
                .await
                .map_err(ApiError::AdaptorError)?;

            Ok(Json(
                adaptor
                    .upsert_person(
                        event_id,
                        Person {
                            name: person_name,
                            password_hash: password
                                .map(|raw| bcrypt::hash(raw, 10).unwrap_or(String::from(""))),
                            created_at: chrono::offset::Utc::now(),
                            availability: vec![],
                        },
                    )
                    .await
                    .map_err(ApiError::AdaptorError)?
                    .into(),
            ))
        }
    }
}

pub fn verify_password(person: &Person, raw: Option<String>) -> bool {
    match &person.password_hash {
        Some(hash) => bcrypt::verify(raw.unwrap_or(String::from("")), hash).unwrap_or(false),
        // Specifically allow a user who doesn't have a password
        // set to log in with or without any password input
        None => true,
    }
}
