# Crab Fit <img width="100" align="right" src="crabfit-frontend/src/res/logo.svg" alt="avatar">

Align your schedules to find the perfect time that works for everyone.
Licensed under the GNU GPLv3.

<a href="https://www.producthunt.com/posts/crab-fit?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-crab-fit" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=291656&theme=light" alt="Crab Fit - Use your availability to find a time that works for everyone | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

## Contributing

### ⭐️ Bugs or feature requests

If you find any bugs or have a feature request, please create an issue by <a href="https://github.com/GRA0007/crab.fit/issues/new/choose">clicking here</a>.

### 🌐 Translations

If you speak a language other than English and you want to help translate Crab Fit, fill out this form: https://forms.gle/azz1yGqhpLUka45S9

## Setup

1. Clone the repo.
2. Run `yarn` in both backend and frontend folders.
3. Run `node index.js` in the backend folder to start the API. **Note:** you will need a google cloud app set up with datastore enabled and set your `GOOGLE_APPLICATION_CREDENTIALS` environment variable to your service key path.
4. Run `yarn start` in the frontend folder to start the front end.

### 🔌 Browser extension
The browser extension in `crabfit-browser-extension` can be tested by first running the frontend, and changing the iframe url in the extension's `popup.html` to match the local Crab Fit. Then it can be loaded as an unpacked extension in Chrome to test.

## Deploy

### 🦀 Frontend
1. In the frontend folder `cd crabfit-frontend`
2. Run `./deploy.sh` to compile and deploy.

### ⚙️ Backend
1. In the backend folder `cd crabfit-backend`
2. Deploy the backend `gcloud app deploy --project=crabfit --version=v1`
3. To deploy cron jobs (i.e. monthly cleanup of old events), run `gcloud app deploy cron.yaml`

### 🔌 Browser extension
Compress everything inside the `crabfit-browser-extension` folder and use that zip to deploy using Chrome web store and Mozilla Add-on store.
