import log from "../utils/log.js";

import pointOfInterestService from "../services/pointOfInterestService.js";
import pointOfInterestLikeService from "../services/pointOfInterestLikeService.js";

export default {
    async likePointOfInterest (req, res) {
        if (!global.devMode && !global.testUserMode && !req.session.osmUserId) {
            log.err(" <= RES /pointofinterestlike/:id forbidden.", req.session);
            res.sendStatus(401);
            return;
        }
        if (!req.params) {
            log.err(" <= RES /pointofinterestlike/:id invalid or no req params.", req.body);
            res.sendStatus(400);
            return;
        }
        if (!req.params.id) {
            log.err(" <= RES /pointofinterestlike/:id invalid or no req param id.", req.body);
            res.sendStatus(400);
            return;
        }

        try {
            await pointOfInterestLikeService.likePointOfInterest(req.params.id, global.testUserMode ? global.osmUserId : req.session.osmUserId, global.testUserMode ? global.osmUserName : req.session.osmUserName);
            
            const newPoi = await pointOfInterestService.getById(req.params.id, global.testUserMode ? global.osmUserId : req.session.osmUserId, global.testUserMode ? global.osmUserName : req.session.osmUserName);

            res.send(newPoi);
        } catch (err) {
            log.err(" <= RES /pointofinterestlike/:id ERROR db error.", err);
            res.sendStatus(500);
        }
    }
};