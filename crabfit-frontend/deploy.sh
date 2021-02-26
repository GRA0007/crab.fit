#!/usr/bin/env bash

yarn build

cd build

cat > app.yaml << EOF
runtime: nodejs12
handlers:
- url: /(.*\..+)$
  static_files: \1
  upload: (.*\..+)$

- url: /.*
  static_files: index.html
  upload: index.html
EOF

gcloud app deploy --project=crabfit
