import log from "../utils/log.js";

import pointOfInterestService from "../services/pointOfInterestService.js";

export default {
    getAllPointOfInterests (req, res) {
        pointOfInterestService.getAllPointOfInterests().then((pointOfInterests) => {
            res.send(pointOfInterests);
        }).catch((err) => {
            log.err(" <= RES /pointofinterest ERROR db error.", err);
            res.sendStatus(500);
        });
    },
    addPointOfInterests (req, res) {
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
            res.sendStatus(401);
            return;
        }

        pointOfInterestService.addPointOfInterest(req.body.title, req.body.description, req.body.longitude, req.body.latitude, req.body.categories, global.testUserMode ? global.osmUserId : req.session.osmUserId, global.testUserMode ? global.osmUserName : req.session.osmUserName).then((pointOfInterest) => {
            res.send(pointOfInterest);
        }).catch((err) => {
            log.err(" <= RES /pointofinterest ERROR db error.", err);
            res.sendStatus(500);
        });
    }
};