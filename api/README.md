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

## Environment

### CORS

In release mode, a `FRONTEND_URL` environment variable is required to correctly restrict cross-origin requests to the frontend.

### Cleanup task

By default, anyone can run the cleanup task at `/tasks/cleanup`. This is usually not an issue, as it's based on when the events were last visited, and not when it's run, but if you'd prefer to restrict runs of the cleanup task (as it can be intensive), set a `CRON_KEY` environment variable in `.env`. This will require sending an `X-Cron-Key` header to the route with a value that matches `CRON_KEY`, or the route will return a 401 Unauthorized error.
