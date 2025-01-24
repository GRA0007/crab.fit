use std::{env, net::SocketAddr, sync::Arc};

use axum::{
    extract,
    http::{
        header::{ACCEPT, AUTHORIZATION, CONTENT_TYPE},
        HeaderValue, Method,
    },
    routing::{get, patch, post},
    Router,
};
use routes::*;
use tokio::sync::Mutex;
use tower_governor::{governor::GovernorConfigBuilder, GovernorLayer};
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing::Level;
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

use crate::adaptors::create_adaptor;
use crate::docs::ApiDoc;

mod adaptors;
mod docs;
mod errors;
mod payloads;
mod routes;

pub struct ApiState<A> {
    adaptor: A,
}

pub type State<A> = extract::State<Arc<Mutex<ApiState<A>>>>;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt().with_max_level(Level::INFO).init();

    // Load env
    dotenvy::dotenv().ok();

    let shared_state = Arc::new(Mutex::new(ApiState {
        adaptor: create_adaptor().await,
    }));

    // CORS configuration
    let cors = CorsLayer::new()
        .allow_credentials(true)
        .allow_headers([AUTHORIZATION, ACCEPT, CONTENT_TYPE])
        .allow_methods([Method::GET, Method::POST, Method::PATCH])
        .allow_origin(
            if cfg!(debug_assertions) {
                "http://localhost:1234".to_owned()
            } else {
                env::var("FRONTEND_URL").expect("Missing FRONTEND_URL environment variable")
            }
            .parse::<HeaderValue>()
            .unwrap(),
        );

    // Rate limiting configuration (using tower_governor)
    // From the docs: Allows bursts with up to 20 requests and replenishes
    // one element after 500ms, based on peer IP.
    let governor_conf = Arc::new(
        GovernorConfigBuilder::default()
            .burst_size(20)
            .finish()
            .unwrap(),
    );

    let app = Router::new()
        .merge(SwaggerUi::new("/docs").url("/docs/openapi.json", ApiDoc::openapi()))
        .route("/", get(get_root))
        .route("/stats", get(stats::get_stats))
        .route("/event", post(event::create_event))
        .route("/event/{event_id}", get(event::get_event))
        .route("/event/{event_id}/people", get(person::get_people))
        .route(
            "/event/{event_id}/people/{person_name}",
            get(person::get_person),
        )
        .route(
            "/event/{event_id}/people/{person_name}",
            patch(person::update_person),
        )
        .route("/tasks/cleanup", get(tasks::cleanup))
        .layer(cors)
        .layer(GovernorLayer {
            config: governor_conf,
        })
        .with_state(shared_state)
        .layer(TraceLayer::new_for_http());

    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));

    println!(
        "🦀 Crab Fit API listening at http://{} in {} mode",
        addr,
        if cfg!(debug_assertions) {
            "debug"
        } else {
            "release"
        }
    );
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(
        listener,
        app.into_make_service_with_connect_info::<SocketAddr>(),
    )
    .with_graceful_shutdown(async {
        tokio::signal::ctrl_c()
            .await
            .expect("Failed to install Ctrl+C handler")
    })
    .await
    .unwrap();
}

async fn get_root() -> String {
    format!("Crab Fit API v{}", env!("CARGO_PKG_VERSION"))
}
