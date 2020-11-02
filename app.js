const log = require("./utils/log.js");
log.inf("Loading middleware...");

const express = require("express");
const session = require("express-session"); 
const bodyParser = require("body-parser");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const path = require("path");
const rateLimit = require("express-rate-limit");
const fs = require("fs");
const exec = require("child_process").exec;

// check for an environment variable
if (!process.env || !process.env.SESSION_SECRET || !process.env.MONGODB_CONNECTION) {
    // For development environments it could be easier to use a file (gitignored)
    if (!fs.existsSync(".env")) {
        log.err("Error loading configuration: Create an .env file with the following values or add them to your environment variables:",
        'SESSION_SECRET="secret here"\n\r' +
        'MONGODB_CONNECTION="connection string"\n\r' +
        'MONGODB_CONNECTION_DEV="connection string dev db"\n\r' +
        'OSM_ADMIN_NAME="name of osm account that is the admin for this app"\n\r' +
        'OSM_ENDPOINT="https://www.openstreetmap.org"\n\r' +
        'OSM_CONSUMER_SECRET="secret here"\n\r' +
        'OSM_CONSUMER_KEY="key here"\n\r' +
        'OSM_API_VERSION="/api/0.6"\n\r' +
        'OSM_DEV_ENDPOINT="https://master.apis.dev.openstreetmap.org"\n\r' +
        'OSM_DEV_CONSUMER_SECRET="dev secret here"\n\r' +
        'OSM_DEV_CONSUMER_KEY="dev key here"\n\r' +
        'OSM_DEV_API_VERSION="/api/0.6"');
        return;
    } else {
        require('dotenv').config();
    }
}

const routeMain = require("./routes/main");
const routeOsm = require("./routes/osm");
const routeSector = require("./routes/sector");
const routeState = require("./routes/state");
const routeEvent = require("./routes/event");
const routeIteration = require("./routes/iteration");

log.inf("Configuring middleware...");
const app = express();

// set global variables based on dev or prod
var mongodbConnection = "";
global.devMode = null;
global.port = 8081;
global.appRoot = path.resolve(__dirname);
global.osm = {};
if (process.argv.includes("dev")) {
    log.alt("Dev mode");
    global.localurl = "http://localhost";
    global.devMode = true;
    mongodbConnection = process.env.MONGODB_CONNECTION_DEV;
    global.osm.endpoint = process.env.OSM_DEV_ENDPOINT;
    global.osm.consumer_secret = process.env.OSM_DEV_CONSUMER_SECRET;
    global.osm.consumer_key = process.env.OSM_DEV_CONSUMER_KEY;
    global.osm.api_version = process.env.OSM_DEV_API_VERSION;
} else {
    log.alt("Production mode");
    global.localurl = "https://mappingnorthkorea.com";
    global.devMode = false;
    mongodbConnection = process.env.MONGODB_CONNECTION;
    global.osm.endpoint = process.env.OSM_ENDPOINT;
    global.osm.consumer_secret = process.env.OSM_CONSUMER_SECRET;
    global.osm.consumer_key = process.env.OSM_CONSUMER_KEY;
    global.osm.api_version = process.env.OSM_API_VERSION;
}

// connect with the mongodb database
mongoose.connect(mongodbConnection, { useNewUrlParser: true });
var db = mongoose.connection;
db.on("error", console.error.bind(console, 'connection error:'));
db.once("open", function() {
    log.suc("Connected to the MongoDB Atlas Cloud!");
    
    if (process.argv.includes("dev") && process.argv.includes("resetdb")) {
        log.alt("(RE)POPULATING THE DATABASE");
        require("./utils/populateDb.js").run({ removeCollections: true, keepSessions: false });
    }
});

// enable CORS
app.use(function(req, res, next) {
    var allowedOrigins = ['https://www.mappingnorthkorea.com', 'https://mappingnorthkorea.com', 'https://www.openstreetmap.org', 'https://www.mapwith.ai'];
    
    if (global.devMode) {
        allowedOrigins = allowedOrigins.concat(['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:8081', 'http://localhost:8081']);
    }

    var origin = req.headers.origin;
    
    if (allowedOrigins.includes(origin)) {
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Credentials', true);

    return next();
});
app.enable("trust proxy");

// max 100 api requests per 10 minutes
app.use("/api/", rateLimit({
    windowMs: 10 /* <= amount of minutes */ * 60 * 1000,
    max: 100
}));

// enable session management
app.use(session({
    store: new MongoStore({
        mongooseConnection: mongoose.connection,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    }
}));

// define static files
app.use(express.static(__dirname + "/dist"));

// output and input as json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// return index file if not api
app.use((req, res, next) => {
    if (!req.originalUrl.includes('/api/', 0)) {
        res.sendFile(`${__dirname}/dist/index.html`);
    } else {
        next();
    }
});

// log incomming requests
app.use((req, res, next) => {
    log.inf(`=> ${req.method} ${req.url}`);
    next();
});

// define all routes
log.inf("Setting up routing...");
//app.get("/api/main/getlocation", routeMain.getLocation);
app.post("/api/osm/oauth/request", routeOsm.getRequestToken);
app.get("/api/osm/oauth/callback", routeOsm.doRequestTokenCallback);
app.get("/api/osm/oauth/isauthenticated", routeOsm.getIsAuthenticated);
app.post("/api/osm/oauth/logout", routeOsm.doLogout);
//app.get("/api/osm/getamenities/:s/:w/:n/:e", routeOsm.getAmenities);
app.get("/api/osm/getuserdetails", routeOsm.getUserDetails);
//app.post("/api/osm/uploadnodes", routeOsm.uploadNodes);
app.get("/api/sector", routeSector.getAll);
app.put("/api/sector/:id", routeSector.update);
app.get("/api/sector/generate/:id", routeSector.generateGpxBySectorId);
app.get("/api/state", routeState.getAll);
app.get("/api/event/all/:amount", routeEvent.getAll);
app.get("/api/event/sectorid/:id", routeEvent.getBySectorId);
app.get('/api/iteration/latest', routeIteration.getLatestIteration);
app.get('/api/sector/completed/count/:id', routeSector.getCompletedSectorCountByIterationId);
app.get('/api/sector/split/:id', routeSector.splitSectorBySectorId);
app.delete('/api/sector/:id', routeSector.delete);

// github restarting
app.post('/api/webhook', (req, res) => {
    log.alt("WEBHOOK INITIATED");

    exec("git pull", (err, stdout, stderr) => {
        if (err) {
            log.err("git pull error:", err);
            res.sendStatus(500);
            return;
        }
        exec("npm install", (err, stdout, stderr) => {
            if (err) {
                log.err("npm install error:", err);
                res.sendStatus(500);
                return;
            }
            exec("pm2 restart mnk", (err, stdout, stderr) => {
                if (err) {
                    log.err("pm2 restart mnk error:", err);
                    res.sendStatus(500);
                    return;
                }
                res.sendStatus(200);
            });
        });
    });
});

// server start
log.inf("App setup finish. Starting server...");
app.listen(global.port, () => log.suc("Server running on port " + port));
