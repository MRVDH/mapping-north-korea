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
    }
};