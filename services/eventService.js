import Event from "../models/Event.js";

export default {
    getAll: (req, res) => {
        Event.find({}).sort('-time').limit(parseInt(req.params.amount)).exec(function (err, events) {
            if (err) {
                log.err(" <= RES /event/all/:amount ERROR db error.", err);
                res.sendStatus(500);
                return;
            }
            res.send(events);
        });
    },
}