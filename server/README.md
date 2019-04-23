Dev mode:
``` bash
node app.js dev
```

Production mode:
``` bash
node app.js
```

Populate database:
``` bash
# Dev only for safety reasons. Edit the code in app.js that detects this to do this on production.
node app.js dev node app.js dev
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
