# MappingNorthKorea.com
A collaborative effort to map one of the most isolated countries on earth. This is the front-end and back-end for the tool.

## Contributing
For bug fixes and new features please open an issue and then create a pull request with that issue number plus a short description.

## Making changes in the front end
See the readme in the client folder and make sure to run the build command.

## Preparing the backend
First install all dependencies
``` bash
npm install
```

Either add environment variables, or create an .env file with the following content:
```
SESSION_SECRET="secret here"

MONGODB_CONNECTION="connection string"
MONGODB_CONNECTION_DEV="connection string dev db"

OSM_ADMIN_NAME="name of osm account that is the admin for this app. Useful for testing admin priviliges."

OSM_ENDPOINT="https://www.openstreetmap.org"
OSM_CONSUMER_SECRET="secret here"
OSM_CONSUMER_KEY="key here"
OSM_API_VERSION="/api/0.6"

OSM_DEV_ENDPOINT="https://master.apis.dev.openstreetmap.org"
OSM_DEV_CONSUMER_SECRET="dev secret here"
OSM_DEV_CONSUMER_KEY="dev key here"
OSM_DEV_API_VERSION="/api/0.6"
```

Populate database:
```
See the middleware/environment.js code for the command to populate the db.
```

## Running the backend
Dev mode
``` bash
node app.js dev
```

Dev mode with test user enabled ('logged in', bypassing OAuth). If you need to test the OAuth process then build the client using `npm run build` in the client directory, start the server with `node app.js dev` and navigate to localhost:8081 instead of :8080
``` bash
node app.js dev testuser
```

Production mode. Though you'll not need this during development. This is just for deployments.
``` bash
node app.js
```
