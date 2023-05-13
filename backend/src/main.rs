use std::{net::SocketAddr, sync::Arc};

use axum::{
    extract,
    routing::{get, patch, post},
    Router, Server,
};
use routes::*;
use sql_adaptor::SqlAdaptor;
use tokio::sync::Mutex;

mod errors;
mod payloads;
mod routes;

#[cfg(debug_assertions)]
const MODE: &str = "debug";

#[cfg(not(debug_assertions))]
const MODE: &str = "release";

pub struct ApiState<A> {
    adaptor: A,
}

pub type State<A> = extract::State<Arc<Mutex<ApiState<A>>>>;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    // Load env
    dotenv::dotenv().ok();

    let shared_state = Arc::new(Mutex::new(ApiState {
        adaptor: SqlAdaptor::new().await,
    }));

    let app = Router::new()
        .route("/", get(get_root))
        .route("/stats", get(get_stats))
        .route("/event", post(create_event))
        .route("/event/:event_id", get(get_event))
        .route("/event/:event_id/people", get(get_people))
        .route("/event/:event_id/people/:person_name", get(get_person))
        .route("/event/:event_id/people/:person_name", patch(update_person))
        .with_state(shared_state);

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));

    println!(
        "🦀 Crab Fit API listening at http://{} in {} mode",
        addr, MODE
    );
    Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn get_root() -> String {
    format!("Crab Fit API v{}", env!("CARGO_PKG_VERSION"))
}
