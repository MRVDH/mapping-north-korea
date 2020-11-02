# MappingNorthKorea.com
A collaborative effort to map one of the most isolated countries on earth. This is the front-end and back-end for the tool.

## Contributing
For bug fixes and new features please open an issue and then create a pull request with that issue number plus a short description.

## Making changes in the front end
See the readme in the client folder and make sure to run the build command.

## Running the backend
Dev mode:
``` bash
node app.js dev
```

Production mode:
``` bash
node app.js
```

Populate database:
```
See the app.js code for the command to populate the db.
```

Make sure this folder has a .env file with the following contents.
```
SESSION_SECRET="secret here"

MONGODB_CONNECTION="connection string"
MONGODB_CONNECTION_DEV="connection string dev db"

OSM_ADMIN_NAME="name of osm account that is the admin for this app"

OSM_ENDPOINT="https://www.openstreetmap.org"
OSM_CONSUMER_SECRET="secret here"
OSM_CONSUMER_KEY="key here"
OSM_API_VERSION="/api/0.6"

OSM_DEV_ENDPOINT="https://master.apis.dev.openstreetmap.org"
OSM_DEV_CONSUMER_SECRET="dev secret here"
OSM_DEV_CONSUMER_KEY="dev key here"
OSM_DEV_API_VERSION="/api/0.6"
```
