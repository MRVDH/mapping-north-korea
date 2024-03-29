import rateLimit from "express-rate-limit";
import mongoose from "mongoose";
import session from "express-session";
import log from "../utils/log.js";
import MongoStore from 'connect-mongo';

export default {
    cors (req, res, next) {
        var allowedOrigins = ['https://www.mappingnorthkorea.com', 'https://mappingnorthkorea.com', 'https://www.openstreetmap.org', 'https://www.mapwith.ai'];
    
        if (global.devMode) {
            allowedOrigins = allowedOrigins.concat(['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:8081', 'http://localhost:8081', 'https://master.apis.dev.openstreetmap.org']);
        }

        var origin = req.headers.origin;
        
        if (allowedOrigins.includes(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
        }
        
        res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
        res.header('Access-Control-Allow-Credentials', true);

        return next();
    },
    rateLimit () {
        let maxRequests = 200;

        try {
            maxRequests = parseInt(process.env.MAX_REQUESTS)
        } catch { }

        return rateLimit({
            windowMs: 10 /* <= amount of minutes */ * 60 * 1000,
            max: maxRequests
        });
    },
    session () {
        return session({
            store: MongoStore.create({
                client: mongoose.connection.getClient(),
                autoRemove: 'interval',
                autoRemoveInterval: 1
            }),
            secret: process.env.SESSION_SECRET,
            resave: false,
            saveUninitialized: true,
            cookie: {
                maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            }
        });
    },
    filterNonApiRequests (dirname) {
        return (req, res, next) => {
            if (!req.originalUrl.includes('/api/', 0)) {
                res.sendFile(`${dirname}/dist/index.html`);
            } else {
                next();
            }
        };
    },
    log (req, res, next) {
        log.inf(`=> ${req.method} ${req.url}`);
        next();
    }
}