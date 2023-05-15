use std::{collections::HashMap, error::Error, fmt::Display};

use async_trait::async_trait;
use chrono::Utc;
use common::{
    adaptor::Adaptor,
    event::{Event, EventDeletion},
    person::Person,
    stats::Stats,
};
use tokio::sync::Mutex;

struct State {
    stats: Stats,
    events: HashMap<String, Event>,
    people: HashMap<(String, String), Person>,
}

pub struct MemoryAdaptor {
    state: Mutex<State>,
}

#[async_trait]
impl Adaptor for MemoryAdaptor {
    type Error = MemoryAdaptorError;

    async fn get_stats(&self) -> Result<Stats, Self::Error> {
        let state = self.state.lock().await;

        Ok(state.stats.clone())
    }

    async fn increment_stat_event_count(&self) -> Result<i64, Self::Error> {
        let mut state = self.state.lock().await;

        state.stats.event_count += 1;
        Ok(state.stats.event_count)
    }

    async fn increment_stat_person_count(&self) -> Result<i64, Self::Error> {
        let mut state = self.state.lock().await;

        state.stats.person_count += 1;
        Ok(state.stats.person_count)
    }

    async fn get_people(&self, event_id: String) -> Result<Option<Vec<Person>>, Self::Error> {
        let state = self.state.lock().await;

        // Event doesn't exist
        if state.events.get(&event_id).is_none() {
            return Ok(None);
        }

        Ok(Some(
            state
                .people
                .clone()
                .into_iter()
                .filter_map(|((p_event_id, _), p)| {
                    if p_event_id == event_id {
                        Some(p)
                    } else {
                        None
                    }
                })
                .collect(),
        ))
    }

    async fn upsert_person(&self, event_id: String, person: Person) -> Result<Person, Self::Error> {
        let mut state = self.state.lock().await;

        state
            .people
            .insert((event_id, person.name.clone()), person.clone());

        Ok(person)
    }

    async fn get_event(&self, id: String) -> Result<Option<Event>, Self::Error> {
        let mut state = self.state.lock().await;

        let event = state.events.get(&id).cloned();
        if let Some(mut event) = event.clone() {
            event.visited_at = Utc::now();
            state.events.insert(id, event);
        }

        Ok(event)
    }

    async fn create_event(&self, event: Event) -> Result<Event, Self::Error> {
        let mut state = self.state.lock().await;

        state.events.insert(event.id.clone(), event.clone());

        Ok(event)
    }

    async fn delete_event(&self, id: String) -> Result<EventDeletion, Self::Error> {
        let mut state = self.state.lock().await;

        let mut person_count: u64 = state.people.len() as u64;
        state.people = state
            .people
            .clone()
            .into_iter()
            .filter(|((event_id, _), _)| event_id != &id)
            .collect();
        person_count -= state.people.len() as u64;

        state.events.remove(&id);

        Ok(EventDeletion { id, person_count })
    }
}

impl MemoryAdaptor {
    pub async fn new() -> Self {
        println!("🧠 Using in-memory storage");
        println!("🚨 WARNING: All data will be lost when the process ends. Make sure you choose a database adaptor before deploying.");

        let state = Mutex::new(State {
            stats: Stats {
                event_count: 0,
                person_count: 0,
            },
            events: HashMap::new(),
            people: HashMap::new(),
        });

        Self { state }
    }
}

#[derive(Debug)]
pub enum MemoryAdaptorError {}

impl Display for MemoryAdaptorError {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "Memory adaptor error")
    }
}

impl Error for MemoryAdaptorError {}
