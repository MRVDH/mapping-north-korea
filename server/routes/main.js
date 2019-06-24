const log = require("../utils/log.js");

module.exports = {
    /*getLocation: (req, res) => {
        log.inf("=> GET /loc");
        var ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress.split(":").pop();
        var send;
        if (ip === "127.0.0.1" || ip === "1") {
            send = [52.379189, 4.899431]; // Amsterdam
        } else {
            send = geoip.lookup(ip).ll;
        }
        log.inf(" <= RES /loc SUCCESS");
        res.send(send);
    }*/
};