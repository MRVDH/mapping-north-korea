import osmController from "../controllers/osmController.js";
import sectorController from "../controllers/sectorController.js";
import sectorSetController from "../controllers/sectorSetController.js";
import stateController from "../controllers/stateController.js";
import eventController from "../controllers/eventController.js";
import iterationController from "../controllers/iterationController.js";
import pointOfInterestController from "../controllers/pointOfInterestController.js";
import pointOfInterestCategoryController from "../controllers/pointOfInterestCategoryController.js";

export default {
    async setUpRouting(app) {
        app.post("/api/osm/oauth/request", osmController.getRequestToken);
        app.get("/api/osm/oauth/callback", osmController.doRequestTokenCallback);
        app.get("/api/osm/oauth/isauthenticated", osmController.getIsAuthenticated);
        app.post("/api/osm/oauth/logout", osmController.doLogout);
        app.get("/api/osm/getuserdetails", osmController.getUserDetails);

        app.get("/api/sector", sectorController.getAll);
        app.put("/api/sector/:id", sectorController.update);
        app.get("/api/sector/sectorset/:sectorSetId", sectorController.getBySectorSetId);
        app.get("/api/sector/generate/:id", sectorController.generateGpxBySectorId);
        app.get('/api/sector/split/:id', sectorController.splitSectorBySectorId);
        app.delete('/api/sector/:id', sectorController.delete);

        app.get("/api/sectorset/iteration/:id", sectorSetController.getAllSectorSetsByIterationId);
        app.put("/api/sectorset/recount/:id", sectorSetController.recountSectorSetCounts);

        app.get("/api/state", stateController.getAll);

        app.post("/api/event/add", eventController.add);
        app.get("/api/event/all/:amount", eventController.getAll);
        app.get("/api/event/sectorid/:id", eventController.getBySectorId);

        app.get('/api/iteration/current', iterationController.getCurrentIteration);

        app.get('/api/pointofinterest', pointOfInterestController.getAllPointOfInterests);
        app.get('/api/pointofinterestcategories', pointOfInterestCategoryController.getAllPointOfInterestCategories);
    }
}