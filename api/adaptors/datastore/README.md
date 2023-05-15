# Google Datastore Adaptor

This adaptor works with [Google Cloud Datastore](https://cloud.google.com/datastore). Please note that it's compatible with Firestore in Datastore mode, but not with Firestore.

## Environment

To use this adaptor, make sure you have the `GCP_CREDENTIALS` environment variable set to your service account credentials in JSON format. See [this page](https://developers.google.com/workspace/guides/create-credentials#service-account) for info on setting up a service account and generating credentials.

Example:

```env
GCP_CREDENTIALS='{"type":"service_account","project_id":"my-project"}'
```
