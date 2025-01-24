use std::{env, error::Error, fmt::Display};

use async_trait::async_trait;
use chrono::{DateTime, Utc};
use common::{Adaptor, Event, Person, Stats};
use google_cloud::{
    authorize::ApplicationCredentials,
    datastore::{Client, Filter, FromValue, IntoValue, Key, KeyID, Query},
};
use tokio::sync::Mutex;

pub struct DatastoreAdaptor {
    client: Mutex<Client>,
}

// Keys
const STATS_KIND: &str = "Stats";
const EVENT_KIND: &str = "Event";
const PERSON_KIND: &str = "Person";
const STATS_EVENTS_ID: &str = "eventCount";
const STATS_PEOPLE_ID: &str = "personCount";

#[async_trait]
impl Adaptor for DatastoreAdaptor {
    type Error = DatastoreAdaptorError;

    async fn get_stats(&self) -> Result<Stats, Self::Error> {
        let mut client = self.client.lock().await;

        let event_key = Key::new(STATS_KIND).id(STATS_EVENTS_ID);
        let event_stats: DatastoreStats = client.get(event_key).await?.unwrap_or_default();

        let person_key = Key::new(STATS_KIND).id(STATS_PEOPLE_ID);
        let person_stats: DatastoreStats = client.get(person_key).await?.unwrap_or_default();

        Ok(Stats {
            event_count: event_stats.value,
            person_count: person_stats.value,
        })
    }

    async fn increment_stat_event_count(&self) -> Result<i64, Self::Error> {
        let mut client = self.client.lock().await;

        let key = Key::new(STATS_KIND).id(STATS_EVENTS_ID);
        let mut event_stats: DatastoreStats = client.get(key.clone()).await?.unwrap_or_default();

        event_stats.value += 1;
        client.put((key, event_stats.clone())).await?;
        Ok(event_stats.value)
    }

    async fn increment_stat_person_count(&self) -> Result<i64, Self::Error> {
        let mut client = self.client.lock().await;

        let key = Key::new(STATS_KIND).id(STATS_PEOPLE_ID);
        let mut person_stats: DatastoreStats = client.get(key.clone()).await?.unwrap_or_default();

        person_stats.value += 1;
        client.put((key, person_stats.clone())).await?;
        Ok(person_stats.value)
    }

    async fn get_people(&self, event_id: String) -> Result<Option<Vec<Person>>, Self::Error> {
        let mut client = self.client.lock().await;

        // Check the event exists
        if client
            .get::<DatastoreEvent, _>(Key::new(EVENT_KIND).id(event_id.clone()))
            .await?
            .is_none()
        {
            return Ok(None);
        }

        Ok(Some(
            client
                .query(
                    Query::new(PERSON_KIND)
                        .filter(Filter::Equal("eventId".into(), event_id.into_value())),
                )
                .await?
                .into_iter()
                .filter_map(|entity| {
                    DatastorePerson::from_value(entity.properties().clone())
                        .ok()
                        .map(|ds_person| ds_person.into())
                })
                .collect(),
        ))
    }

    async fn upsert_person(
        &self,
        event_id: String,
        person: Person,
    ) -> Result<Option<Person>, Self::Error> {
        let mut client = self.client.lock().await;

        // Check the event exists
        if client
            .get::<DatastoreEvent, _>(Key::new(EVENT_KIND).id(event_id.clone()))
            .await?
            .is_none()
        {
            return Ok(None);
        }

        // Check if person exists
        let existing_person = client
            .query(
                Query::new(PERSON_KIND)
                    .filter(Filter::Equal(
                        "eventId".into(),
                        event_id.clone().into_value(),
                    ))
                    .filter(Filter::Equal(
                        "name".into(),
                        person.name.clone().into_value(),
                    )),
            )
            .await?;

        let mut key = Key::new(PERSON_KIND);
        if let Some(entity) = existing_person.first() {
            key = entity.key().clone();
        }

        client
            .put((key, DatastorePerson::from_person(person.clone(), event_id)))
            .await?;

        Ok(Some(person))
    }

    async fn get_event(&self, id: String) -> Result<Option<Event>, Self::Error> {
        let mut client = self.client.lock().await;

        let key = Key::new(EVENT_KIND).id(id.clone());
        let existing_event = client.get::<DatastoreEvent, _>(key.clone()).await?;

        // Mark as visited if it exists
        if let Some(mut event) = existing_event.clone() {
            event.visited = Utc::now().timestamp();
            client.put((key, event)).await?;
        }

        Ok(existing_event.map(|e| e.to_event(id)))
    }

    async fn create_event(&self, event: Event) -> Result<Event, Self::Error> {
        let mut client = self.client.lock().await;

        let key = Key::new(EVENT_KIND).id(event.id.clone());

        let ds_event: DatastoreEvent = event.clone().into();
        client.put((key, ds_event)).await?;

        Ok(event)
    }

    async fn delete_events(&self, cutoff: DateTime<Utc>) -> Result<Stats, Self::Error> {
        let mut client = self.client.lock().await;

        let mut keys_to_delete: Vec<Key> = client
            .query(Query::new(EVENT_KIND).filter(Filter::LesserThan(
                "visited".into(),
                cutoff.timestamp().into_value(),
            )))
            .await?
            .iter()
            .map(|entity| entity.key().clone())
            .collect();

        let event_count = keys_to_delete.len() as i64;

        let events_to_delete = keys_to_delete.clone();
        for e in events_to_delete.iter() {
            if let KeyID::StringID(id) = e.get_id() {
                let mut event_people_to_delete: Vec<Key> = client
                    .query(
                        Query::new(PERSON_KIND)
                            .filter(Filter::Equal("eventId".into(), id.clone().into_value())),
                    )
                    .await?
                    .iter()
                    .map(|entity| entity.key().clone())
                    .collect();
                keys_to_delete.append(&mut event_people_to_delete);
            }
        }

        let person_count = keys_to_delete.len() as i64 - event_count;

        client.delete_all(keys_to_delete).await?;

        Ok(Stats {
            event_count,
            person_count,
        })
    }
}

impl DatastoreAdaptor {
    pub async fn new() -> Self {
        // Load credentials
        let credentials: ApplicationCredentials = serde_json::from_str(
            &env::var("GCP_CREDENTIALS").expect("Expected GCP_CREDENTIALS environment variable"),
        )
        .expect("GCP_CREDENTIALS environment variable is not valid JSON");

        // Connect to datastore
        let client = Client::from_credentials(credentials.project_id.clone(), credentials.clone())
            .await
            .expect("Failed to setup datastore client");
        let client = Mutex::new(client);

        println!(
            "🎛️  Connected to datastore in project {}",
            credentials.project_id
        );

        Self { client }
    }
}

#[derive(FromValue, IntoValue, Default, Clone)]
struct DatastoreStats {
    value: i64,
}

#[derive(FromValue, IntoValue, Clone)]
struct DatastoreEvent {
    name: String,
    created: i64,
    visited: i64,
    times: Vec<String>,
    timezone: String,
}

#[derive(FromValue, IntoValue)]
#[allow(non_snake_case)]
struct DatastorePerson {
    name: String,
    password: Option<String>,
    created: i64,
    eventId: String,
    availability: Vec<String>,
}

impl From<DatastorePerson> for Person {
    fn from(value: DatastorePerson) -> Self {
        Self {
            name: value.name,
            password_hash: value.password,
            created_at: unix_to_date(value.created),
            availability: value.availability,
        }
    }
}

impl DatastorePerson {
    fn from_person(person: Person, event_id: String) -> Self {
        Self {
            name: person.name,
            password: person.password_hash,
            created: person.created_at.timestamp(),
            eventId: event_id,
            availability: person.availability,
        }
    }
}

impl From<Event> for DatastoreEvent {
    fn from(value: Event) -> Self {
        Self {
            name: value.name,
            created: value.created_at.timestamp(),
            visited: value.visited_at.timestamp(),
            times: value.times,
            timezone: value.timezone,
        }
    }
}

impl DatastoreEvent {
    fn to_event(&self, event_id: String) -> Event {
        Event {
            id: event_id,
            name: self.name.clone(),
            created_at: unix_to_date(self.created),
            visited_at: unix_to_date(self.visited),
            times: self.times.clone(),
            timezone: self.timezone.clone(),
        }
    }
}

fn unix_to_date(unix: i64) -> DateTime<Utc> {
    DateTime::from_timestamp(unix, 0).unwrap()
}

#[derive(Debug)]
pub enum DatastoreAdaptorError {
    DatastoreError(google_cloud::error::Error),
}

impl Display for DatastoreAdaptorError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        match self {
            DatastoreAdaptorError::DatastoreError(e) => write!(f, "Datastore Error: {}", e),
        }
    }
}

impl Error for DatastoreAdaptorError {}

impl From<google_cloud::error::Error> for DatastoreAdaptorError {
    fn from(value: google_cloud::error::Error) -> Self {
        Self::DatastoreError(value)
    }
}

impl From<google_cloud::error::ConvertError> for DatastoreAdaptorError {
    fn from(value: google_cloud::error::ConvertError) -> Self {
        Self::DatastoreError(google_cloud::error::Error::Convert(value))
    }
}
