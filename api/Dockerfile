# This dockerfile builds the API and runs it on a minimal container with the Datastore adaptor

ARG RUST_VERSION=latest

FROM rust:"$RUST_VERSION" as cache

FROM rust:"$RUST_VERSION" as builder

# Install CA Certs for Hyper
RUN apt-get install -y --no-install-recommends ca-certificates
RUN update-ca-certificates

WORKDIR /usr/src/app
COPY . .

ARG STORAGE_ADAPTOR=datastore-adaptor
ENV STORAGE_ADAPTOR="${STORAGE_ADAPTOR}"
# Will build and cache the binary and dependent crates in release mode
RUN --mount=type=cache,target=/usr/local/cargo,from=cache,source=/usr/local/cargo \
    --mount=type=cache,target=target \
    cargo build --release --features "${STORAGE_ADAPTOR}" && mv ./target/release/crabfit-api ./api

# Runtime image
# Fix by https://github.com/GRA0007/crab.fit/issues/305#issuecomment-2051767577
FROM debian:bookworm-slim

# Run as "app" user
RUN useradd -ms /bin/bash app
RUN mkdir -p /app/db
RUN chown app:app /app/db

# A "fix" from https://github.com/GRA0007/crab.fit/issues/315#issuecomment-1868545940
RUN apt -qqy update && apt -qqy install openssl

USER app
WORKDIR /app

# Get compiled binaries from builder's cargo install directory
COPY --from=builder /usr/src/app/api /app/api
COPY --from=builder /etc/ssl/certs/ca-certificates.crt /etc/ssl/certs/

# Run the app
EXPOSE 3000
CMD ./api
