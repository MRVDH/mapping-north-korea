import log from "../utils/log.js";

import sectorSetService from "../services/sectorSetService.js";

export default {
    getAllSectorSetsByIterationId (req, res) {
        if (req.params.id === "" || req.params.id === null || req.params.id === undefined) {
            log.err(" <= RES /sectorset/iteration/:id invalid or no req param id.", req.params);
            res.sendStatus(400);
            return;
        }

        sectorSetService.getAllSectorSetsByIterationId(req.params.id).then((sectorSets) => {
            res.send(sectorSets);
        }).catch((err) => {
            log.err(" <= RES /sectorset/iteration/:id ERROR db error.", err);
            res.sendStatus(500);
        });
    },
    recountSectorSetCounts (req, res) {
        if (req.params.id === "" || req.params.id === null || req.params.id === undefined) {
            log.err(" <= RES /sectorset/recount/:id invalid or no req param id.", req.params);
            res.sendStatus(400);
            return;
        }

        sectorSetService.recountSectorSetCounts(req.params.id).then(() => {
            res.send();
        }).catch((err) => {
            log.err(" <= RES /sectorset/iteration/:id ERROR db error.", err);
            res.sendStatus(500);
        });
    }
};