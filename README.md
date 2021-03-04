# Crabfit <img width="100" align="right" src="crabfit-frontend/src/res/logo.svg" alt="avatar">

Align your schedules to find the perfect time that works for everyone.

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
