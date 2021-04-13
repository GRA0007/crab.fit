#!/usr/bin/env bash

yarn build

cd build

cat > app.yaml << EOF
runtime: nodejs12
handlers:
- url: /(.*\..+)$
  static_files: \1
  upload: (.*\..+)$
  secure: always
  redirect_http_response_code: 301

- url: /.*
  static_files: index.html
  upload: index.html
  secure: always
  redirect_http_response_code: 301
EOF

gcloud app deploy --project=crabfit
