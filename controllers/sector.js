import log from "../utils/log.js";

import sectorService from "../services/sectorService.js";

export default {
    getAll (req, res) {
        sectorService.getAll().then((sectors) => {
            res.send(sectors);
        }).catch((err) => {
            log.err(" <= RES /sector ERROR db error.", err);
            res.sendStatus(500);
        });
    },
    getBySectorSetId (req, res) {
        if (req.params.sectorSetId === "" || req.params.sectorSetId === null || req.params.sectorSetId === undefined) {
            log.err(" <= RES /sector/sectorset/:sectorSetId invalid or no req param id.", req.params);
            res.sendStatus(400);
            return;
        }

        sectorService.getBySectorSetId(req.params.sectorSetId).then((sectors) => {
            res.send(sectors);
        }).catch((err) => {
            log.err(" <= RES /sector/sectorset/:sectorSetId ERROR db error.", err);
            res.sendStatus(500);
        });
    },
    async update (req, res) {
        if ((req.session.osmUserId === "" || req.session.osmUserId === null || req.session.osmUserId === undefined) && !global.testUserMode) {
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

        sectorService.update(req.params.id, req.body.sector, req.body.state, req.body.comment, global.testUserMode ? global.osmUserId : req.session.osmUserId, global.testUserMode ? global.osmUserName : req.session.osmUserName).then((result) => {
            res.send(result);
        }).catch((err) => {
            log.err(" <= RES /sector/:id db update error.", err);
            res.sendStatus(500);
        });
    },
    generateGpxBySectorId (req, res) {
        if (req.params.id === "" || req.params.id === null || req.params.id === undefined) {
            log.err(" <= RES /sector/generate/:id invalid or no req param id.", req.params);
            res.sendStatus(400);
            return;
        }

        var id = req.params.id.split(".")[0];

        sectorService.generateGpxBySectorId(id).then((xmlString) => {
            res.set("Content-Disposition", "attachment; filename=" + id + ".gpx");
            res.set("Content-Type", "text/xml");
            res.send(xmlString);
        }).catch((err) => {
            log.err(" <= RES /sector/generate/:id ERROR db error.", err);
            res.sendStatus(500);
        });
    },
    getCompletedSectorCountByIterationId (req, res) {
        if (req.params.id === "" || req.params.id === null || req.params.id === undefined) {
            log.err(" <= RES /api/sector/completed/count/:id invalid or no req param id.", req.params);
            res.sendStatus(400);
            return;
        }

        sectorService.getCompletedSectorCountByIterationId(req.params.id).then((result) => {
            res.send(result);
        }).catch((err) => {
            log.err(" <= RES /api/sector/completed/count/:id db update error.", err);
            res.sendStatus(500);
        });
    },
    delete: (req, res) => {
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

        sectorService.delete(req.params.id).then((result) => {
            res.send(result);
        }).catch((err) => {
            log.err(" <= DELETE /sector/:id ERROR db error.", err);
            res.sendStatus(500);
        });
    },
    splitSectorBySectorId: (req, res) => {
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

        sectorService.splitSectorBySectorId(req.params.id).then((result) => {
            res.send(result);
        }).catch((err) => {
            log.err(" <= RES /sector/split/:id ERROR db error.", err);
            res.sendStatus(500);
        });
    }
};