# Crab Fit API

This is the API for Crab Fit, written in Rust. It uses the [axum](https://crates.io/crates/axum) framework to run a HTTP server, and supports multiple storage adaptors.

## API docs

OpenAPI compatible API docs are generated using [utoipa](https://crates.io/crates/utoipa). You can visit them at [https://api.crab.fit/docs](https://api.crab.fit/docs).

## Storage adaptors

| Adaptor | Works with |
| ------- | ---------- |
| `memory-adaptor` | Stores data in memory |
| `sql-adaptor` | Postgres, MySQL, SQLite |
| `datastore-adaptor` | Google Datastore |

To choose an adaptor, specify it in the `features` when compiling, e.g. `cargo run --features sql-adaptor`.

Some adaptors require environment variables to be set. You can specify them in a `.env` file and they'll be loaded in using [dotenvy](https://crates.io/crates/dotenvy). See a specific adaptor's readme for more information.

> **Note**
> `memory-adaptor` is the default if no features are specified. Ensure you specify a different adaptor when deploying.

### Adding an adaptor

See [adding an adaptor](adaptors/README.md#adding-an-adaptor) in the adaptors readme.
