# Goal 2 - set up PWA and connect to API
- set up a skeleton PWA with a single page to render exercises
- deploy app to Netlify and ensure it can hit the deployed API on Railway (set up in [Goal 1](goal-1-api-returns-data.md))

## Steps
### Sign up for Netlify
- Follow the steps in the [Netlify setup](../technical/deploy/index.md) section.
- Use [Folder structure](../technical/folder-structure.md) and the [Netlify configuration file section](../technical/deploy/index.md) to create a minimal PWA in the ./src folder, using the [technology choices](../technical/client-app/tech-choices.md)
- the PWA should have one initial route - `GET /exercises` which will hit the API endpoint `GET /exercises` endpoint then render the exercises that are returned
- no authentication needed for the time being
- write the absolute minimum code and config required to achieve this goal

## Testing / confirmation
Hit the local and deployed endpoints to verify that data is returned.

