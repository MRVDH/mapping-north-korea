import log from "../utils/log.js";

import Iteration from "../models/Iteration.js";

export default {
    getLatestIteration: (req, res) => {
        Iteration.find({}).sort('-start').exec(function (err, iterations) { 
            if (err) {
                log.err(" <= RES /iteration/latest ERROR db error.", err);
                res.sendStatus(500);
                return;
            }
            res.send(iterations[0]);
        });
    }
};