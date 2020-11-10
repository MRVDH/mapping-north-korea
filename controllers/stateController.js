import log from "../utils/log.js";

import stateService from "../services/stateService.js";

export default {
    getAll (req, res) {
        stateService.getAll().then((states) => {
            res.send(states);
        }).catch((err) => {
            log.err(" <= RES /state ERROR db error.", err);
            res.sendStatus(500);
        });
    }
};