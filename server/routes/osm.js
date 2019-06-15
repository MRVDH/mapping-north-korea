const request = require("request");
const fxp = require("fast-xml-parser");
const qs = require("querystring");

const utils = require("../utils/utils.js");
const log = require("../utils/log.js");

module.exports = {
    getUserDetails: (req, res) => {
        log.inf("=> GET /osm/getuserdetails");
        
        request({
            url: global.osm.endpoint + global.osm.api_version + "/user/details",
            method: "GET",
            oauth: {
                consumer_key: global.osm.consumer_key,
                consumer_secret: global.osm.consumer_secret,
                token: req.session.access_token,
                token_secret: req.session.access_token_secret
            },
            headers: {
                "content-type": "text/xml"
            }
        }, (err, rs, body) => {
            if (err) {
                log.err(" <= RES /osm/getuserdetails ERROR request error", [ err, body ]);
                res.sendStatus(500);
                return;
            }
            if(!fxp.validate(body)) {
                log.err(" <= RES /osm/getuserdetails ERROR response error", [ body ]);
                res.sendStatus(500);
                return;
            }

            var jsonBody = fxp.parse(body, { ignoreAttributes: false });

            if (!jsonBody.osm) {
                log.err(" <= RES /osm/getuserdetails ERROR response error", [ jsonBody, body ]);
                res.sendStatus(500);
                return;
            }
            
            req.session.osmUserName = jsonBody.osm.user["@_display_name"];
            req.session.osmUserId = jsonBody.osm.user["@_id"];
            res.send({
                id: jsonBody.osm.user["@_id"],
                name: jsonBody.osm.user["@_display_name"]
            });
        });
    },
    getRequestToken: (req, res) => {
        log.inf("=> POST /oauth/request");
        request.post({
            url: global.osm.endpoint + "/oauth/request_token", 
            oauth: {
                callback: global.localurl + (global.devMode ? ":" + global.port : "") + "/api/osm/oauth/callback",
                consumer_key: global.osm.consumer_key,
                consumer_secret: global.osm.consumer_secret
            }
        }, (err, rs, body) => {
            if (err) {
                log.err(" <= RES /oauth/request ERROR request token failed.", [ err, body ]);
                res.sendStatus(500);
                return;
            }
            var bodyObject = qs.parse(body);
            req.session.oauth_token = bodyObject.oauth_token;
            req.session.oauth_token_secret = bodyObject.oauth_token_secret;
            res.send(global.osm.endpoint + "/oauth/authorize?oauth_token=" + bodyObject.oauth_token);
        });
    },
    doRequestTokenCallback: (req, res) => {
        log.alt("=> GET /oauth/callback");
        request.post({
            url: global.osm.endpoint + "/oauth/access_token", 
            oauth: {
                consumer_key: global.osm.consumer_key,
                consumer_secret: global.osm.consumer_secret,
                token: req.query.oauth_token,
                token_secret: req.session.oauth_token_secret,
                verifier: req.query.oauth_verifier
            }
        }, (err, rs, body) => {
            if (err) {
                log.err(" <= RES /oauth/callback ERROR token callback failed", [ err, body ]);
                res.sendStatus(500);
            } else {
                var perm_data = qs.parse(body);
                req.session.access_token = perm_data.oauth_token;
                req.session.access_token_secret = perm_data.oauth_token_secret;
                res.redirect(global.localurl + (global.devMode ? ":" + global.port : ""));
            }
        });
    },
    getIsAuthenticated: (req, res) => {
        log.inf("=> GET /oauth/isauthenticated");
        if (req.session.access_token && req.session.access_token_secret) {
            res.send({ isAuthenticated: true });
        } else {
            res.send({ isAuthenticated: false });
        }
    },
    doLogout: (req, res) => {
        log.inf("=> GET /oauth/logout");
        req.session.destroy((err) => {
            if (err) {
                log.err(" <= RES /oauth/logout ERROR", err);
                res.sendStatus(500);
            } else {
                res.sendStatus(200);
            }
        });
    }
};