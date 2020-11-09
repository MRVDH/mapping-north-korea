import osmController from "../controllers/osm.js";
import sectorController from "../controllers/sector.js";
import sectorSetController from "../controllers/sectorSet.js";
import stateController from "../controllers/state.js";
import eventController from "../controllers/event.js";
import iterationController from "../controllers/iteration.js";

export default {
    async setUpRouting(app) {
        app.post("/api/osm/oauth/request", osmController.getRequestToken);
        app.get("/api/osm/oauth/callback", osmController.doRequestTokenCallback);
        app.get("/api/osm/oauth/isauthenticated", osmController.getIsAuthenticated);
        app.post("/api/osm/oauth/logout", osmController.doLogout);
        app.get("/api/osm/getuserdetails", osmController.getUserDetails);

        app.get("/api/sector", sectorController.getAll);
        app.put("/api/sector/:id", sectorController.update);
        app.get("/api/sector/generate/:id", sectorController.generateGpxBySectorId);
        app.get('/api/sector/completed/count/:id', sectorController.getCompletedSectorCountByIterationId);
        app.get('/api/sector/split/:id', sectorController.splitSectorBySectorId);
        app.delete('/api/sector/:id', sectorController.delete);

        app.get("/api/sectorset/iteration/:id", sectorSetController.getAllSectorSetsByIterationId);

        app.get("/api/state", stateController.getAll);

        app.post("/api/event/add", eventController.add);
        app.get("/api/event/all/:amount", eventController.getAll);
        app.get("/api/event/sectorid/:id", eventController.getBySectorId);

        app.get('/api/iteration/current', iterationController.getCurrentIteration);
    }
}