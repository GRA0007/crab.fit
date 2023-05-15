use chrono::{DateTime, Utc};

#[derive(Clone)]
pub struct Event {
    pub id: String,
    pub name: String,
    pub created_at: DateTime<Utc>,
    pub visited_at: DateTime<Utc>,
    pub times: Vec<String>,
    pub timezone: String,
}

#[derive(Clone)]
/// Info about a deleted event
pub struct EventDeletion {
    pub id: String,
    /// The amount of people that were in this event that were also deleted
    pub person_count: u64,
}
