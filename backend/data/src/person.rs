use chrono::{DateTime, Utc};

pub struct Person {
    pub name: String,
    pub password_hash: Option<String>,
    pub created_at: DateTime<Utc>,
    pub availability: Vec<String>,
}
