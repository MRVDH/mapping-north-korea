import log from "../utils/log.js";

import State from "../models/State.js";

export default {
    getAll: (req, res) => {
        State.find({}, function (err, states) {
            if (err) {
                log.err(" <= RES /state ERROR db error.", err);
                res.sendStatus(500);
                return;
            }
            res.send(states);
        });
    }
};