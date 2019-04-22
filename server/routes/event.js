const mongoose = require("mongoose");
const log = require("../utils/log.js");

const Iteration = require("../models/Iteration.js");
const SectorSet = require("../models/SectorSet.js");
const State = require("../models/State.js");
const Sector = require("../models/Sector.js");
const Event = require("../models/Event.js");

module.exports = {
    getAll: (req, res) => {
        log.inf("=> GET /event/all/:amount");

        if (req.params.amount === "" || req.params.amount === null || req.params.amount === undefined) {
            log.err(" <= RES /event/all/:amount invalid or no req param amount.", req.params);
            res.sendStatus(400);
            return;
        }

        Event.find({}).sort('-time').limit(parseInt(req.params.amount)).exec(function (err, events) {
            if (err) {
                log.err(" <= RES /event/all/:amount ERROR db error.", err);
                res.sendStatus(500);
                return;
            }
            res.send(events);
        });
    },
    getBySectorId: (req, res) => {
        log.inf("=> GET /event/sector/:id");

        if (req.params.id === "" || req.params.id === null || req.params.id === undefined) {
            log.err(" <= RES /event/sector/:id invalid or no req param id.", req.params);
            res.sendStatus(400);
            return;
        }
        
        Event.find({ sector: req.params.id }, function (err, events) {
            if (err) {
                log.err(" <= RES /event/sector/:id ERROR db error.", err);
                res.sendStatus(500);
                return;
            }
            res.send(events);
        });
    }
};