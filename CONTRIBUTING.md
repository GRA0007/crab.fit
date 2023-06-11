# Contributing to Crab Fit

## Creating Issues

If you find any bugs or have a feature request, please [create an issue](https://github.com/GRA0007/crab.fit/issues/new/choose).

## Translating

If you speak a language other than English and you want to help translate Crab Fit, visit [Crab Fit on Transifex](https://explore.transifex.com/crab-fit/crab-fit/) and click "Join this project".

For more information on how to translate, visit the [translating wiki page](https://github.com/GRA0007/crab.fit/wiki/Translating).

## Local Development

This is a guide on getting Crab Fit working locally for development purposes. You should first follow this if you're thinking of making a [pull request](#pull-requests).

Note: if you'd like to get Crab Fit running because you want to have your own instance, please instead follow the [self-hosting](https://github.com/GRA0007/crab.fit/wiki/Self%E2%80%90hosting) guide.

### Software

Crab Fit is written using Rust (for the API) and Next.js (for the frontend). Before you begin, you'll need to make sure you have the required software installed:

| Software | Installation instructions |
| --- | --- |
| git | You'll need git to clone the repository. You likely already have it if you're on MacOS, otherwise see the [git site](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git). |
| node | I recommend using `nvm` or `fnm` to manage multiple node versions, but you can also install directly from the [node.js website](https://nodejs.org/en/download). |
| yarn | Node comes with `npm`, which you can use to run `npm install --global yarn` to install yarn. |
| rust | You can install rust by following the directions on the [rust website](https://www.rust-lang.org/tools/install). |

### Setup

1. Clone the repository.
2. Run `cargo run` in the `api` folder to build and start the API.
3. Run `yarn` in `frontend` folder to install dependencies, then `yarn dev` to start the dev server.

By default, the API will start at http://localhost:3000, and the frontend will be available at http://localhost:1234.

#### Code Documentation

For code-specific documentation, please see the README files in the repo.

### Browser Extension

The Crab Fit browser extension is currently an iFrame that points to `/create` on the frontend. To test, edit the `popup.html` file's iframe src to be `http://localhost:1234/create`, then view that in your browser.

Note that you can't just visit the url directly, as it will redirect to the full create form if not running within an iFrame.

## Pull Requests

Before starting a pull request, first check if there's an issue open that your pull request will resolve. If there isn't, please create one to give the community a chance to comment, and also to prevent others from working on similar pull requests that will conflict with yours.

Mention the issue you are closing at the top of your PR like so:
```
Closes #123

[describe your PR...]
```

## Git Branch Conventions

`main`
Production branch. Do not commit directly to this branch.

`feat/*`
Prefix new feature branches with feat. When complete, submit a PR into main.

`fix/*`
When fixing a bug, prefix branches with fix. When complete, submit a PR into main.

`refactor/*`
For refactoring code. When complete, submit a PR into main.

`chore/*`
For chores like adding type checking, setting up CI, fixing typos etc. When finished, submit a PR into main.

`docs/*`
Used when updating documentation such as README files. When finished, submit a PR into main.
