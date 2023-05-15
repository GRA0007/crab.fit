#[cfg(feature = "sql-adaptor")]
pub async fn create_adaptor() -> sql_adaptor::SqlAdaptor {
    sql_adaptor::SqlAdaptor::new().await
}

#[cfg(feature = "datastore-adaptor")]
pub async fn create_adaptor() -> datastore_adaptor::DatastoreAdaptor {
    datastore_adaptor::DatastoreAdaptor::new().await
}

pub async fn create_adaptor() -> memory_adaptor::MemoryAdaptor {
    memory_adaptor::MemoryAdaptor::new().await
}
