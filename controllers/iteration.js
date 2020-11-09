import log from "../utils/log.js";

import iterationService from "../services/iterationService.js";

export default {
    getCurrentIteration (req, res) {
        iterationService.getCurrentIteration().then((iteration) => {
            res.send(iteration);
        }).catch((err) => {
            log.err(" <= RES /iteration/current ERROR db error.", err);
            res.sendStatus(500);
        });
    }
};