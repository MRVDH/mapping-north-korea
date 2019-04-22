const mongoose = require("mongoose");
const log = require("../utils/log.js");

const Iteration = require("../models/Iteration.js");
const SectorSet = require("../models/SectorSet.js");
const State = require("../models/State.js");
const Sector = require("../models/Sector.js");
const Event = require("../models/Event.js");

module.exports = {
    getAll: (req, res) => {
        log.inf("=> GET /state");
        
        State.find({}, function (err, states) {
            if (err) {
                log.err(" <= RES /state ERROR db error.", err);
                res.sendStatus(500);
                return;
            }
            res.send(states);
        });
    }
};