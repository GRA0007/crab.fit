use chrono::{DateTime, Utc};

pub struct Event {
    pub id: String,
    pub name: String,
    pub created_at: DateTime<Utc>,
    pub times: Vec<String>,
    pub timezone: String,
}

/// Info about a deleted event
pub struct EventDeletion {
    pub id: String,
    /// The amount of people that were in this event that were also deleted
    pub person_count: u64,
}
