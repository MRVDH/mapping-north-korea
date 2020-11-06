import fs from "fs";
import dotenv from 'dotenv';
import path from "path";
import log from "../utils/log.js";

export default {
    async validateEnvironmentVariables () {
        if (process.env && process.env.SESSION_SECRET && process.env.MONGODB_CONNECTION) {
            return;
        }

        // For development environments it could be easier to use a file (gitignored)
        if (fs.existsSync(".env")) {
            dotenv.config();
        } else {
            throw "Error loading configuration: Create an .env file with the following values or add them to your environment variables:",
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
            'OSM_DEV_API_VERSION="/api/0.6"';
        }
    },
    async setGlobalVariables(dirname) {
        global.port = 8081;
        global.appRoot = path.resolve(dirname);
        
        if (process.argv.includes("dev")) {
            global.testUserMode = process.argv.includes("testuser");
            
            log.alt("Dev mode " + (global.testUserMode ? "+ test user mode" : ""));

            if (global.testUserMode) {
                global.osmUserId = 1234;
                global.osmUserName = "testuser";
            }

            global.localurl = "http://localhost";
            global.devMode = true;
            global.mongodbConnection = process.env.MONGODB_CONNECTION_DEV;
        
            global.osm = {
                endpoint: process.env.OSM_DEV_ENDPOINT,
                consumer_secret: process.env.OSM_DEV_CONSUMER_SECRET,
                consumer_key: process.env.OSM_DEV_CONSUMER_KEY,
                api_version: process.env.OSM_DEV_API_VERSION
            }
        } else {
            log.alt("Production mode");
            global.localurl = "https://www.mappingnorthkorea.com";
            global.devMode = false;
            global.mongodbConnection = process.env.MONGODB_CONNECTION;
        
            global.osm = {
                endpoint: process.env.OSM_ENDPOINT,
                consumer_secret: process.env.OSM_CONSUMER_SECRET,
                consumer_key: process.env.OSM_CONSUMER_KEY,
                api_version: process.env.OSM_API_VERSION
            }
        }
    }
};