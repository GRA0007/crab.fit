use std::net::SocketAddr;

use axum::{routing::get, Router, Server};
use data::adaptor::Adaptor;
use sql_adaptor::PostgresAdaptor;

#[cfg(debug_assertions)]
const MODE: &str = "debug";

#[cfg(not(debug_assertions))]
const MODE: &str = "release";

#[tokio::main]
async fn main() {
    // Load env
    dotenv::dotenv().ok();

    PostgresAdaptor::new().await;

    let app = Router::new().route("/", get(get_root));

    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));

    println!("Crab Fit API listening at http://{} in {} mode", addr, MODE);
    Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

async fn get_root() -> String {
    format!("Crab Fit API v{}", env!("CARGO_PKG_VERSION"))
}
