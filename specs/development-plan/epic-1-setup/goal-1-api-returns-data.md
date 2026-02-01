
# Goal 1 - deployed API returns database data
- sending a `GET /exercises` request to the API deployed on Railway returns an array of the Exercise data (which can be as simple as `{ name: String }` for now) from the PostgreSQL database
- create only the *minimum* amount of code locally to achieve this goal

## Steps
### Sign up for Railway
[Instructions](../../technical/deploy/index.md)

### Create basic API and database locally
Using [Folder structure](../../technical/folder-structure.md) and [API / DB](../../technical/api-db/index.md) for reference, create the `api` top level folder only and populate it with the minimum amount of code to:
- add NPM tasks to package.json
- basic Prisma and PostgreSQL setup, for the Exercise data type and table only
- seed the exercises data table with a single record - `{ name: "Assisted pull up" }`
- no authorisation needed at this stage, it will be added later
- simple Express setup with one `GET /exercises` route
- simplest required Railway config and env vars so the API can be deployed

### CI / deployment config
Using [Folder structure](../../technical/folder-structure.md) and [deploy](../../technical/deploy/index.md) for reference, create the `.github` top level folder only and add the minimum amount of config so that when changes are pushed to the repo, the API will be deployed to Railway and seeded

## Testing / confirmation
Hit the local and deployed endpoints to verify that data is returned.
