# Crabfit <img width="100" align="right" src="crabfit-frontend/src/res/logo.svg" alt="avatar">

Align your schedules to find the perfect time that works for everyone.

<a href="https://www.producthunt.com/posts/crab-fit?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-crab-fit" target="_blank"><img src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=291656&theme=light" alt="Crab Fit - Use your availability to find a time that works for everyone | Product Hunt" style="width: 250px; height: 54px;" width="250" height="54" /></a>

## Setup

1. Clone the repo.
2. Run `yarn` in both folders.
3. Run `node index.js` in the backend folder to start the API.
4. Run `yarn start` in the frontend folder to start the front end.

## Deploy

### Frontend
1. In the frontend folder `cd crabfit-frontend`
2. Run `./deploy.sh` to compile and deploy.

### Backend
1. Deploy the backend `cd crabfit-backend && gcloud app deploy --project=crabfit`
2. Deploy the endpoints service `cd crabfit-backend && gcloud endpoints services deploy swagger.yaml`
