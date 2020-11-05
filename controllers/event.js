import log from "../utils/log.js";

import eventService from "../services/eventService.js";

export default {
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