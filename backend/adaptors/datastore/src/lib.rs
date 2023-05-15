use std::{collections::HashMap, env, error::Error, fmt::Display};

use async_trait::async_trait;
use chrono::{DateTime, NaiveDateTime, Utc};
use common::{
    adaptor::Adaptor,
    event::{Event, EventDeletion},
    person::Person,
    stats::Stats,
};
use google_cloud::{
    authorize::ApplicationCredentials,
    datastore::{Client, Filter, FromValue, IntoValue, Key, Query, Value},
    error::ConvertError,
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

        let key = Key::new(STATS_KIND);
        let event_count = client
            .get(key.clone().id(STATS_EVENTS_ID))
            .await?
            .unwrap_or(0);
        let person_count = client.get(key.id(STATS_PEOPLE_ID)).await?.unwrap_or(0);

        Ok(Stats {
            event_count,
            person_count,
        })
    }

    async fn increment_stat_event_count(&self) -> Result<i64, Self::Error> {
        let mut client = self.client.lock().await;

        let key = Key::new(STATS_KIND).id(STATS_EVENTS_ID);
        let event_count = client.get(key.clone()).await?.unwrap_or(0) + 1;
        client.put((key, event_count)).await?;
        Ok(event_count)
    }

    async fn increment_stat_person_count(&self) -> Result<i64, Self::Error> {
        let mut client = self.client.lock().await;

        let key = Key::new(STATS_KIND).id(STATS_PEOPLE_ID);
        let person_count = client.get(key.clone()).await?.unwrap_or(0) + 1;
        client.put((key, person_count)).await?;
        Ok(person_count)
    }

    async fn get_people(&self, event_id: String) -> Result<Option<Vec<Person>>, Self::Error> {
        let mut client = self.client.lock().await;

        // Check the event exists
        if client
            .get::<Value, _>(Key::new(EVENT_KIND).id(event_id.clone()))
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
                .filter_map(|entity| parse_into_person(entity.properties().clone()).ok())
                .collect(),
        ))
    }

    async fn upsert_person(&self, event_id: String, person: Person) -> Result<Person, Self::Error> {
        let mut client = self.client.lock().await;

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

        let mut properties = HashMap::new();
        properties.insert(String::from("name"), person.name.clone().into_value());
        if let Some(password_hash) = person.password_hash.clone() {
            properties.insert(String::from("password"), password_hash.into_value());
        }
        properties.insert(String::from("eventId"), event_id.into_value());
        properties.insert(
            String::from("created"),
            person.created_at.clone().timestamp().into_value(),
        );
        properties.insert(
            String::from("availability"),
            person.availability.clone().into_value(),
        );

        client.put((key, properties)).await?;

        Ok(person)
    }

    async fn get_event(&self, id: String) -> Result<Option<Event>, Self::Error> {
        let mut client = self.client.lock().await;

        let key = Key::new(EVENT_KIND).id(id.clone());
        let existing_event = client.get::<Value, _>(key.clone()).await?;

        // Mark as visited if it exists
        if let Some(mut event) = existing_event
            .clone()
            .map(HashMap::<String, Value>::from_value)
            .transpose()?
        {
            event.insert(String::from("visited"), Utc::now().timestamp().into_value());
            client.put((key, event)).await?;
        }

        Ok(existing_event
            .map(|value| parse_into_event(id, value))
            .transpose()?)
    }

    async fn create_event(&self, event: Event) -> Result<Event, Self::Error> {
        let mut client = self.client.lock().await;

        let key = Key::new(EVENT_KIND).id(event.id.clone());

        let mut properties = HashMap::new();
        properties.insert(String::from("name"), event.name.clone().into_value());
        properties.insert(
            String::from("created"),
            event.created_at.clone().timestamp().into_value(),
        );
        properties.insert(
            String::from("visited"),
            event.visited_at.clone().timestamp().into_value(),
        );
        properties.insert(String::from("times"), event.times.clone().into_value());
        properties.insert(
            String::from("timezone"),
            event.timezone.clone().into_value(),
        );

        client.put((key, properties)).await?;

        Ok(event)
    }

    async fn delete_event(&self, id: String) -> Result<EventDeletion, Self::Error> {
        let mut client = self.client.lock().await;

        let mut people_keys: Vec<Key> = client
            .query(
                Query::new(PERSON_KIND)
                    .filter(Filter::Equal("eventId".into(), id.clone().into_value())),
            )
            .await?
            .iter()
            .map(|entity| entity.key().clone())
            .collect();

        let person_count = people_keys.len().try_into().unwrap();
        people_keys.insert(0, Key::new(EVENT_KIND).id(id.clone()));

        client.delete_all(people_keys).await?;

        Ok(EventDeletion { id, person_count })
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

fn parse_into_person(value: Value) -> Result<Person, DatastoreAdaptorError> {
    let person: HashMap<String, Value> = HashMap::from_value(value)?;
    Ok(Person {
        name: String::from_value(
            person
                .get("name")
                .ok_or(ConvertError::MissingProperty("name".to_owned()))?
                .clone(),
        )?,
        password_hash: person
            .get("password")
            .map(|p| String::from_value(p.clone()))
            .transpose()?,
        created_at: DateTime::from_utc(
            NaiveDateTime::from_timestamp_opt(
                i64::from_value(
                    person
                        .get("created")
                        .ok_or(ConvertError::MissingProperty("created".to_owned()))?
                        .clone(),
                )?,
                0,
            )
            .unwrap(),
            Utc,
        ),
        availability: Vec::from_value(
            person
                .get("availability")
                .ok_or(ConvertError::MissingProperty("availability".to_owned()))?
                .clone(),
        )?,
    })
}

fn parse_into_event(id: String, value: Value) -> Result<Event, DatastoreAdaptorError> {
    let event: HashMap<String, Value> = HashMap::from_value(value)?;
    Ok(Event {
        id,
        name: String::from_value(
            event
                .get("name")
                .ok_or(ConvertError::MissingProperty("name".to_owned()))?
                .clone(),
        )?,
        created_at: DateTime::from_utc(
            NaiveDateTime::from_timestamp_opt(
                i64::from_value(
                    event
                        .get("created")
                        .ok_or(ConvertError::MissingProperty("created".to_owned()))?
                        .clone(),
                )?,
                0,
            )
            .unwrap(),
            Utc,
        ),
        visited_at: DateTime::from_utc(
            NaiveDateTime::from_timestamp_opt(
                i64::from_value(
                    event
                        .get("visited")
                        .ok_or(ConvertError::MissingProperty("visited".to_owned()))?
                        .clone(),
                )?,
                0,
            )
            .unwrap(),
            Utc,
        ),
        times: Vec::from_value(
            event
                .get("times")
                .ok_or(ConvertError::MissingProperty("times".to_owned()))?
                .clone(),
        )?,
        timezone: String::from_value(
            event
                .get("timezone")
                .ok_or(ConvertError::MissingProperty("timezone".to_owned()))?
                .clone(),
        )?,
    })
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
