const mongoose = require("mongoose");
const log = require("../utils/log.js");

const Iteration = require("../models/Iteration.js");
const SectorSet = require("../models/SectorSet.js");
const State = require("../models/State.js");
const Sector = require("../models/Sector.js");
const Event = require("../models/Event.js");

module.exports = {
    getLatestIteration: (req, res) => {
        Iteration.find({}).sort('-start').exec(function (err, iterations) { 
            if (err) {
                log.err(" <= RES /iteration/latest ERROR db error.", err);
                res.sendStatus(500);
                return;
            }
            res.send(iterations[0]);
        });
    }
};