import log from "../utils/log.js";

import iterationService from "../services/iterationService.js";

export default {
    getLatestIteration (req, res) {
        iterationService.getLatestIteration().then((iteration) => {
            res.send(iteration);
        }).catch((err) => {
            log.err(" <= RES /iteration/latest ERROR db error.", err);
            res.sendStatus(500);
        });
    }
};