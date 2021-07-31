import log from "../utils/log.js";

import pointOfInterestService from "../services/pointOfInterestService.js";

export default {
    getAllPointOfInterests (req, res) {
        let currentUserId;
        let currentUserName;

        if (global.testUserMode || req?.session?.osmUserId) {
            currentUserId = global.testUserMode ? global.osmUserId : req.session.osmUserId;
            currentUserName = global.testUserMode ? global.osmUserName : req.session.osmUserName;
        }

        pointOfInterestService.getAllPointOfInterests(currentUserId, currentUserName).then((pointOfInterests) => {
            res.send(pointOfInterests);
        }).catch((err) => {
            log.err(" <= RES /pointofinterest ERROR db error.", err);
            res.sendStatus(500);
        });
    },
    addPointOfInterest (req, res) {
        if (!req.body) {
            log.err(" <= RES /pointofinterest invalid or no req body.", req.body);
            res.sendStatus(400);
            return;
        }
        if (!req.body.title) {
            log.err(" <= RES /pointofinterest invalid or no req body param title.", req.body);
            res.sendStatus(400);
            return;
        }
        if (!req.body.longitude) {
            log.err(" <= RES /pointofinterest invalid or no req body param longitude.", req.body);
            res.sendStatus(400);
            return;
        }
        if (!req.body.latitude) {
            log.err(" <= RES /pointofinterest invalid or no req body param latitude.", req.body);
            res.sendStatus(400);
            return;
        }
        if (!req.body.categories || !req.body.categories.length) {
            log.err(" <= RES /pointofinterest invalid or no req body param categories.", req.body);
            res.sendStatus(400);
            return;
        }
        if (!req.session.osmUserId && !global.testUserMode) {
            log.err(" <= RES /pointofinterest unauthorized.", req.body);
            res.sendStatus(403);
            return;
        }

        pointOfInterestService.addPointOfInterest(req.body.title, req.body.description, req.body.longitude, req.body.latitude, req.body.categories, global.testUserMode ? global.osmUserId : req.session.osmUserId, global.testUserMode ? global.osmUserName : req.session.osmUserName).then((pointOfInterest) => {
            res.send(pointOfInterest);
        }).catch((err) => {
            log.err(" <= RES /pointofinterest ERROR db error.", err);
            res.sendStatus(500);
        });
    },
    updatePointOfInterest (req, res) {
        if (!req.body) {
            log.err(" <= RES /pointofinterest invalid or no req body.", req.body);
            res.sendStatus(400);
            return;
        }
        if (!req.body._id) {
            log.err(" <= RES /pointofinterest invalid or no req body param id.", req.body);
            res.sendStatus(400);
        }
        if (!req.body.title) {
            log.err(" <= RES /pointofinterest invalid or no req body param title.", req.body);
            res.sendStatus(400);
            return;
        }
        if (!req.body.longitude) {
            log.err(" <= RES /pointofinterest invalid or no req body param longitude.", req.body);
            res.sendStatus(400);
            return;
        }
        if (!req.body.latitude) {
            log.err(" <= RES /pointofinterest invalid or no req body param latitude.", req.body);
            res.sendStatus(400);
            return;
        }
        if (!req.body.categories || !req.body.categories.length) {
            log.err(" <= RES /pointofinterest invalid or no req body param categories.", req.body);
            res.sendStatus(400);
            return;
        }
        if (!req.session.osmUserId && !global.testUserMode) {
            log.err(" <= RES /pointofinterest unauthorized.", req.body);
            res.sendStatus(403);
            return;
        }

        pointOfInterestService.updatePointOfInterest(req.body).then((pointOfInterest) => {
            res.send(pointOfInterest);
        }).catch((err) => {
            log.err(" <= RES /pointofinterest ERROR db error.", err);
            res.sendStatus(500);
        });
    },
    deletePointOfInterest (req, res) {
        if (!req.params) {
            log.err(" <= RES /pointofinterest/like/:id invalid or no req params.", req.body);
            res.sendStatus(400);
            return;
        }
        if (!req.params.id) {
            log.err(" <= RES /pointofinterest/like/:id invalid or no req param id.", req.body);
            res.sendStatus(400);
            return;
        }
        if (!req.session.osmUserId && !global.testUserMode) {
            log.err(" <= RES /pointofinterest/like/:id unauthorized.", req.body);
            res.sendStatus(403);
            return;
        }

        pointOfInterestService.likePointOfInterest(req.params.id).then((pointOfInterest) => {
            res.send(pointOfInterest);
        }).catch((err) => {
            log.err(" <= RES /pointofinterest/like/:id ERROR db error.", err);
            res.sendStatus(500);
        });
    }
};