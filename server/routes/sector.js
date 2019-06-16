const mongoose = require("mongoose");
const log = require("../utils/log.js");

const Iteration = require("../models/Iteration.js");
const SectorSet = require("../models/SectorSet.js");
const State = require("../models/State.js");
const Sector = require("../models/Sector.js");
const Event = require("../models/Event.js");

module.exports = {
    getAll: (req, res) => {
        log.inf("=> GET /sector");
        
        Sector.find({})
            .populate({
                path: "sectorSet",
                populate: {
                    path: "iteration"
                }
            })
            .populate({
                path: "state"
            }).exec(function (err, sectors) {
                if (err) {
                    log.err(" <= RES /sector ERROR db error.", err);
                    res.sendStatus(500);
                    return;
                }
                res.send(sectors);
        });
    },
    update: async function (req, res) {
        log.inf("=> PUT /sector/:id");

        if (req.session.osmUserId === "" || req.session.osmUserId === null || req.session.osmUserId === undefined) {
            log.err(" <= RES /sector/:id unauthorized.", req.params);
            res.sendStatus(401);
            return;
        }
        if (req.params.id === "" || req.params.id === null || req.params.id === undefined) {
            log.err(" <= RES /sector/:id invalid or no req param id.", req.params);
            res.sendStatus(400);
            return;
        }
        if (req.body === "" || req.body === null || req.body === undefined) {
            log.err(" <= RES /sector/:id invalid or no req body.", req.body);
            res.sendStatus(400);
            return;
        }
        if (req.body.sector === "" || req.body.sector === null || req.body.sector === undefined) {
            log.err(" <= RES /sector/:id invalid or no sector.", req.body);
            res.sendStatus(400);
            return;
        }
        if (req.body.state === "" || req.body.state === null || req.body.state === undefined) {
            log.err(" <= RES /sector/:id invalid or no state.", req.body);
            res.sendStatus(400);
            return;
        }
        if (req.body.comment.length > 500) {
            log.err(" <= RES /sector/:id comment too long.", req.body);
            res.sendStatus(400);
            return;
        }

        // Check if a comment was added.
        var newEventComment = null;
        if (req.body.comment.length !== 0) {
            newEventComment = new Event({
                description: req.body.comment,
                sector: req.body.sector,
                time: new Date(),
                osmUserId: req.session.osmUserId,
                osmUserName: req.session.osmUserName
            });
            newEventComment = await newEventComment.save();
        }

        // Don't do anything if there is no new state.
        if (req.body.sector.state._id !== req.body.state._id) {
            req.body.sector.state = req.body.state;
            Sector.findOneAndUpdate({ _id: req.params.id }, req.body.sector, async function (err) {
                if (err) {
                    log.err(" <= RES /sector/:id db update error.", err);
                    res.sendStatus(500);
                    return;
                }

                var newEventState = new Event({
                    description: "State changed to " + req.body.sector.state.title,
                    sector: req.body.sector,
                    time: new Date(),
                    osmUserId: req.session.osmUserId,
                    osmUserName: req.session.osmUserName
                });
                newEventState = await newEventState.save();

                if (req.body.comment.length === 0) {
                    res.send({
                        sector: req.body.sector,
                        events: [ newEventState ]
                    });
                    return;
                }

                res.send({
                    sector: req.body.sector,
                    events: [ newEventState, newEventComment ]
                });
            });
        } else {
            if (req.body.comment.length !== 0) {
                res.send({
                    sector: req.body.sector,
                    events: [ newEventComment ]
                });
            } else {
                res.send({
                    sector: req.body.sector,
                    events: []
                });
            }
        }
    },
    generateGpxBySectorId: (req, res) => {
        log.inf("=> GET /sector/generate/:id");
        
        if (req.params.id === "" || req.params.id === null || req.params.id === undefined) {
            log.err(" <= RES /sector/generate/:id invalid or no req param id.", req.params);
            res.sendStatus(400);
            return;
        }

        var id = req.params.id.split(".")[0];

        Sector.findById(id, function (err, sector) {
            if (err) {
                log.err(" <= RES /sector/generate/:id ERROR db error.", err);
                res.sendStatus(500);
                return;
            }

            var xmlString = '<?xml version="1.0" encoding="utf8"?>' +
                '<gpx creator="MappingNorthKorea.com" version="1.1" xmlns="http://www.topografix.com/GPX/1/1">' +
                '<metadata><link href="https://mappingnorthkorea.com/"><text>Mapping North Korea</text></link><time>' + new Date().toISOString().slice(0, -1) + '</time></metadata>' +
                '<trk>' + '<name>Sector ' + id + '. Do not edit outside of this area!</name><trkseg>';
            
            for (var coord of sector.coordinates[0]) {
                xmlString += '<trkpt lat="' + coord[1] + '" lon="' + coord[0] + '" />';
            }
            xmlString += '</trkseg></trk>';
            for (var coord of sector.coordinates[0]) {
                xmlString += '<wpt lat="' + coord[1] + '" lon="' + coord[0] + '" />';
            }
            xmlString += '</gpx>';

            res.set("Content-Disposition", "attachment; filename=" + id + ".gpx");
            res.set("Content-Type", "text/xml");
            res.send(xmlString);
        });
    },
    getCompletedSectorCountByIterationId: (req, res) => {
        log.inf("=> GET /api/sector/completed/count/:id");

        if (req.params.id === "" || req.params.id === null || req.params.id === undefined) {
            log.err(" <= RES /api/sector/completed/count/:id invalid or no req param id.", req.params);
            res.sendStatus(400);
            return;
        }

        SectorSet.find({ iteration: req.params.id }, async function (err, sectorSets) {
            if (err) {
                log.err(" <= RES /api/sector/completed/count/:id db update error.", err);
                res.sendStatus(500);
                return;
            }

            var doneState = await State.find({ title: 'Completed' });

            var totalCount = 0;
            var doneCount = 0;
            for (var sectorSet of sectorSets) {
                totalCount += await Sector.countDocuments({ sectorSet: sectorSet._id });
                doneCount += await Sector.countDocuments({ sectorSet: sectorSet._id, state: doneState[0]._id });
            }
            res.send({ totalCount: totalCount, doneCount: doneCount });
        });
    },
    delete: (req, res) => {
        log.inf("=> DELETE /api/sector/:id");

        if (!global.devMode) {
            if (req.session.osmUserName !== process.env.OSM_ADMIN_NAME) {
                log.err(" <= RES /sector/split/:id unauthorised.", req.session);
                res.sendStatus(403);
                return;
            }
        }
        if (req.params.id === "" || req.params.id === null || req.params.id === undefined) {
            log.err(" <= DELETE /sector/:id invalid or no req param id.", req.params);
            res.sendStatus(400);
            return;
        }

        Sector.deleteOne({ _id: req.params.id }, function (err) {
            if (err) {
                log.err(" <= DELETE /sector/:id ERROR db error.", err);
                res.sendStatus(500);
                return;
            }

            Event.deleteMany({ sector: req.params.id }, function (err1) {
                if (err1) {
                    log.err(" <= DELETE /sector/:id ERROR db error.", err1);
                    res.sendStatus(500);
                    return;
                }

                res.send(true);
            });
        });
    },
    splitSectorBySectorId: (req, res) => {
        log.inf("=> GET /api/sector/split/:id");

        if (!global.devMode) {
            if (req.session.osmUserName !== process.env.OSM_ADMIN_NAME) {
                log.err(" <= RES /sector/split/:id unauthorised.", req.session);
                res.sendStatus(403);
                return;
            }
        }
        if (req.params.id === "" || req.params.id === null || req.params.id === undefined) {
            log.err(" <= RES /sector/split/:id invalid or no req param id.", req.params);
            res.sendStatus(400);
            return;
        }

        Sector.find({ _id: req.params.id }, function (err, results) {
            if (err) {
                log.err(" <= RES /sector/split/:id ERROR db error.", err);
                res.sendStatus(500);
                return;
            }
            if (results.length === 0) {
                res.send(null);
                return;
            }
            var originalSector = results[0];

            var coordinates = originalSector.coordinates[0];

            // ostl = original sector top left
            var ostl = coordinates[0];
            var ostr = coordinates[1];
            var osbr = coordinates[2];
            var osbl = coordinates[3];

            // lat = x, lng = y
            var ostllat = ostl[0];
            var ostllng = ostl[1];
            var ostrlat = ostr[0];
            var ostrlng = ostr[1];
            var osbrlat = osbr[0];
            var osbrlng = osbr[1];
            var osbllat = osbl[0];
            var osbllng = osbl[1];

            // ncm = new coordinate middle
            var ncmlat = (ostllat + ostrlat) / 2;
            var ncmlng = (ostllng + osbllng) / 2;

            var sectorsCoords = [[
                [ostllat, ostllng],
                [ncmlat, (ostllng + ostrlng) / 2],
                [ncmlat, ncmlng],
                [(ostllat + osbllat) / 2, ncmlng],
                [ostllat, ostllng]
            ], [
                [ncmlat, (ostllng + ostrlng) / 2],
                [ostrlat, ostrlng],
                [(ostrlat + osbrlat) / 2, ncmlng],
                [ncmlat, ncmlng],
                [ncmlat, (ostllng + ostrlng) / 2]
            ], [
                [ncmlat, ncmlng],
                [(osbrlat + ostrlat) / 2, ncmlng],
                [osbrlat, osbrlng],
                [ncmlat, (osbrlng + osbllng) / 2],
                [ncmlat, ncmlng]
            ], [
                [(ostllat + osbllat) / 2, ncmlng],
                [ncmlat, ncmlng],
                [ncmlat, (osbllng + osbrlng) / 2],
                [osbllat, osbllng],
                [(ostllat + osbllat) / 2, ncmlng]
            ]];

            var newSectors = [];
            for (var i = 0; i < 4; i++) {
                newSectors.push({
                    coordinates: [sectorsCoords[i]],
                    state: originalSector.state,
                    sectorSet: originalSector.sectorSet
                });
            }

            Sector.create(newSectors, function (err, uploadedSectors) {
                if (err) {
                    log.err(" <= RES /sector/split/:id ERROR db error.", err);
                    res.sendStatus(500);
                    return;
                }

                Event.find({ sector: originalSector._id }, function (err1, events) {
                    if (err1) {
                        log.err(" <= RES /event/sector/:id ERROR db error.", err1);
                        res.sendStatus(500);
                        return;
                    }

                    var eventsToUpload = [];

                    for (var uploadedSector of uploadedSectors) {
                        for (var event of events) {
                            eventsToUpload.push({
                                description: event.description,
                                sector: uploadedSector._id.toString(),
                                time: event.time,
                                osmUserId: event.osmUserId,
                                osmUserName: event.osmUserName
                            });
                        }
                    }

                    Event.create(eventsToUpload, function (err2, uploadedEvents) {
                        if (err2) {
                            log.err(" <= RES /event/sector/:id ERROR db error.", err2);
                            res.sendStatus(500);
                            return;
                        }

                        Sector.deleteOne({ _id: originalSector._id }, function (err3) {
                            if (err3) {
                                log.err(" <= RES /event/sector/:id ERROR db error.", err3);
                                res.sendStatus(500);
                                return;
                            }

                            res.send({
                                originalSector: originalSector,
                                newSectors: uploadedSectors
                            });
                        });
                    });
                });
            });
        });
    }
};