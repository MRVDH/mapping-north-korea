import log from "../utils/log.js";

import eventService from "../services/eventService.js";

export default {
    add (req, res) {
        if (req.body === "" || req.body === null || req.body === undefined) {
            log.err(" <= RES /event/add invalid or no req body.", req.body);
            res.sendStatus(400);
            return;
        }
        if (req.body.sectorId === "" || req.body.sectorId === null || req.body.sectorId === undefined) {
            log.err(" <= RES /event/add invalid or no req body param sectorId.", req.body);
            res.sendStatus(400);
            return;
        }
        if (req.body.description === "" || req.body.description === null || req.body.description === undefined) {
            log.err(" <= RES /event/add invalid or no req body param description.", req.body);
            res.sendStatus(400);
            return;
        }
        if ((req.session.osmUserId === "" || req.session.osmUserId === null || req.session.osmUserId === undefined) && !global.testUserMode) {
            log.err(" <= RES /event/add unauthorized.", req.body);
            res.sendStatus(401);
            return;
        }

        eventService.add(req.body.sectorId, req.body.description, global.testUserMode ? global.osmUserId : req.session.osmUserId, global.testUserMode ? global.osmUserName : req.session.osmUserName).then((newEvent) => {
            res.send(newEvent);
        }).catch((err) => {
            log.err(" <= RES /event/add ERROR db error.", err);
            res.sendStatus(500);
        });
    },
    getAll (req, res) {
        if (req.params.amount === "" || req.params.amount === null || req.params.amount === undefined) {
            log.err(" <= RES /event/all/:amount invalid or no req param amount.", req.params);
            res.sendStatus(400);
            return;
        }

        eventService.getAll(req.params.amount).then((events) => {
            res.send(events);
        }).catch((err) => {
            log.err(" <= RES /event/all/:amount ERROR db error.", err);
            res.sendStatus(500);
        });
    },
    getBySectorId (req, res) {
        if (req.params.id === "" || req.params.id === null || req.params.id === undefined) {
            log.err(" <= RES /event/sector/:id invalid or no req param id.", req.params);
            res.sendStatus(400);
            return;
        }

        eventService.getBySectorId(req.params.id).then((events) => {
            res.send(events);
        }).catch((err) => {
            log.err(" <= RES /event/sector/:id ERROR db error.", err);
            res.sendStatus(500);
        });
    }
};