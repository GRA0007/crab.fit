use std::{env, net::SocketAddr, sync::Arc};

use axum::{
    error_handling::HandleErrorLayer,
    extract,
    http::{HeaderValue, Method},
    routing::{get, patch, post},
    BoxError, Router, Server,
};
use routes::*;
use sql_adaptor::SqlAdaptor;
use tokio::sync::Mutex;
use tower::ServiceBuilder;
use tower_governor::{errors::display_error, governor::GovernorConfigBuilder, GovernorLayer};
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use utoipa::OpenApi;
use utoipa_swagger_ui::SwaggerUi;

mod errors;
mod payloads;
mod routes;

pub struct ApiState<A> {
    adaptor: A,
}

pub type State<A> = extract::State<Arc<Mutex<ApiState<A>>>>;

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    // Load env
    dotenv::dotenv().ok();

    #[derive(OpenApi)]
    #[openapi(
        info(title = "Crab Fit API"),
        paths(
            routes::get_stats::get_stats,
            routes::create_event::create_event,
            routes::get_event::get_event,
            routes::get_people::get_people,
            routes::get_person::get_person,
            routes::update_person::update_person,
        ),
        components(
            schemas(
                payloads::StatsResponse,
                payloads::EventResponse,
                payloads::PersonResponse,
                payloads::EventInput,
                payloads::GetPersonInput,
                payloads::UpdatePersonInput,
            ),
        ),
        tags(
            (name = "info"),
            (name = "event"),
            (name = "person"),
        ),
    )]
    struct ApiDoc;

    let shared_state = Arc::new(Mutex::new(ApiState {
        adaptor: SqlAdaptor::new().await,
    }));

    // CORS configuration
    let cors = CorsLayer::new()
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
    // From the docs: Allows bursts with up to eight requests and replenishes
    // one element after 500ms, based on peer IP.
    let governor_config = Box::new(GovernorConfigBuilder::default().finish().unwrap());
    let rate_limit = ServiceBuilder::new()
        // Handle errors from governor and convert into HTTP responses
        .layer(HandleErrorLayer::new(|e: BoxError| async move {
            display_error(e)
        }))
        .layer(GovernorLayer {
            config: Box::leak(governor_config),
        });

    let app = Router::new()
        .merge(SwaggerUi::new("/docs").url("/docs/openapi.json", ApiDoc::openapi()))
        .route("/", get(get_root))
        .route("/stats", get(get_stats))
        .route("/event", post(create_event))
        .route("/event/:event_id", get(get_event))
        .route("/event/:event_id/people", get(get_people))
        .route("/event/:event_id/people/:person_name", get(get_person))
        .route("/event/:event_id/people/:person_name", patch(update_person))
        .with_state(shared_state)
        .layer(cors)
        .layer(rate_limit)
        .layer(TraceLayer::new_for_http());

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));

    println!(
        "🦀 Crab Fit API listening at http://{} in {} mode",
        addr,
        if cfg!(debug_assertions) {
            "debug"
        } else {
            "release"
        }
    );
    Server::bind(&addr)
        .serve(app.into_make_service_with_connect_info::<SocketAddr>())
        .await
        .unwrap();
}

async fn get_root() -> String {
    format!("Crab Fit API v{}", env!("CARGO_PKG_VERSION"))
}
