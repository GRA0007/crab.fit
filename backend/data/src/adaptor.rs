use std::error::Error;

use async_trait::async_trait;

use crate::{
    event::{Event, EventDeletion},
    person::Person,
    stats::Stats,
};

/// Data storage adaptor, all methods on an adaptor can return an error if
/// something goes wrong, or potentially None if the data requested was not found.
#[async_trait]
pub trait Adaptor {
    /// Creates a new adaptor and performs all setup required
    ///
    /// # Panics
    /// If an error occurs while setting up the adaptor
    async fn new() -> Self;

    async fn get_stats(&self) -> Result<Stats, Box<dyn Error>>;
    async fn increment_stat_event_count(&self) -> Result<i32, Box<dyn Error>>;
    async fn increment_stat_person_count(&self) -> Result<i32, Box<dyn Error>>;

    async fn get_people(&self, event_id: String) -> Result<Option<Vec<Person>>, Box<dyn Error>>;
    async fn upsert_person(
        &self,
        event_id: String,
        person: Person,
    ) -> Result<Person, Box<dyn Error>>;

    async fn get_event(&self, id: String) -> Result<Option<Event>, Box<dyn Error>>;
    async fn create_event(&self, event: Event) -> Result<Event, Box<dyn Error>>;

    /// Delete an event as well as all related people
    async fn delete_event(&self, id: String) -> Result<EventDeletion, Box<dyn Error>>;
}
