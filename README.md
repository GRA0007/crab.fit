# Crabfit <img width="100" align="right" src="crabfit-frontend/src/res/logo.svg" alt="avatar">

Align your schedules to find the perfect time that works for everyone.

<a href="https://www.producthunt.com/posts/crab-fit?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-crab-fit" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=291656&theme=light" alt="Crab Fit - Use your availability to find a time that works for everyone | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

## Setup

1. Clone the repo.
2. Run `yarn` in both backend and frontend folders.
3. Run `node index.js` in the backend folder to start the API.
4. Run `yarn start` in the frontend folder to start the front end.

### Browser extension
The browser extension in `crabfit-browser-extension` can be tested by first running the frontend, and changing the iframe url in the extension's `popup.html` to match the local Crab Fit. Then it can be loaded as an unpacked extension in Chrome to test.

## Deploy

### Frontend
1. In the frontend folder `cd crabfit-frontend`
2. Run `./deploy.sh` to compile and deploy.

### Backend
1. In the backend folder `cd crabfit-backend`
2. Deploy the backend `gcloud app deploy --project=crabfit --version=v1`

### Browser extension
Compress everything inside the `crabfit-browser-extension` folder and use that zip to deploy using Chrome web store and Mozilla Add-on store.
