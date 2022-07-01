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

## API call
You can make POST requests to directly get a schedule based on some dates.

> Note: format codes are 1989 C, cf. [here](https://docs.python.org/3/library/datetime.html#strftime-and-strptime-format-codes) for instance.

### Request
API endpoint: `https://api-dot-crabfit.uc.r.appspot.com/event`

#### Specific dates
Payload:
```json
{
   "event":{
      "name":"Name of your event",
      "times":[
         "A list of dates in the format HHmm-ddMMyyyy",
         "Please take into account it should be GMT (UTC±00:00)"
      ],
      "timezone":"Your prefered timezone, in the DST format"
   }
}
```

Example:
```json
{
   "event":{
      "name":"Some nerd meeting!",
      "times":[
         "0700-29072022",
         "0800-29072022",
         "0700-15072022",
         "0800-15072022",
         "0700-01072022",
         "0800-01072022",
      ],
      "timezone":"Europe/Paris"
   }
}
```

#### Days of the week
Payload:
```json
{
   "event":{
      "name":"Name of your event",
      "times":[
         "A list of dates in the format HHmm-w",
         "Please take into account it should be GMT (UTC±00:00)"
      ],
      "timezone":"Your prefered timezone, in the DST format"
   }
}
```

Example:
```json
{
   "event":{
      "name":"Some (other) nerd meeting!",
      "times":[
         "0700-1",
         "0800-1",
         "0700-3",
         "0800-3",
         "0700-5",
         "0800-5"
      ],
      "timezone":"Europe/Paris"
   }
}
```

### Response
You should get a JSON response that looks like this:
```json
{
   "id":"link-to-your-schedule",
   "name":"testing api",
   "created":"timestamp",
   "times":[
       "Your chosen dates"
   ],
   "timezone":"Your chosen timezone"
}
```

Example:
```json
{
   "id":"some-final-nerd-meeting-123456",
   "name":"Some (final!) nerd meeting!",
   "created":1656671214,
   "times":[
      "0700-13072022",
      "0800-13072022",
      "0900-13072022"
   ],
   "timezone":"Europe/Paris"
}
```

To use, simply append the `id` to the website, i.e., https://crab.fit/link-to-your-schedule, e.g., https://crab.fit/some-final-nerd-meeting-123456.

### (Python) Example
```python
import requests

request_url = "https://api-dot-crabfit.uc.r.appspot.com/event"
response_url = "https://crab.fit/"

payload = {"event": {"name": "Testing the API !", "times": ["0700-13072022","0800-13072022","0900-13072022"], "timezone":"Europe/Paris"}
response = requests.post(base_url, json=payload)

if response.status_code == 201:
    schedule_url = f"{response_url}{response.json()["id"]}"
else:
    # It did not work 🤷‍♀️ - time for some error handling!
    schedule_url = None  # ... Or not.
```
