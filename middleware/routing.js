import routeOsm from "../routes/osm.js";
import routeSector from "../routes/sector.js";
import routeState from "../routes/state.js";
import routeEvent from "../routes/event.js";
import routeIteration from "../routes/iteration.js";

export default {
    async setUpRouting(app) {
        app.post("/api/osm/oauth/request", routeOsm.getRequestToken);
        app.get("/api/osm/oauth/callback", routeOsm.doRequestTokenCallback);
        app.get("/api/osm/oauth/isauthenticated", routeOsm.getIsAuthenticated);
        app.post("/api/osm/oauth/logout", routeOsm.doLogout);
        app.get("/api/osm/getuserdetails", routeOsm.getUserDetails);

        app.get("/api/sector", routeSector.getAll);
        app.put("/api/sector/:id", routeSector.update);
        app.get("/api/sector/generate/:id", routeSector.generateGpxBySectorId);
        app.get('/api/sector/completed/count/:id', routeSector.getCompletedSectorCountByIterationId);
        app.get('/api/sector/split/:id', routeSector.splitSectorBySectorId);
        app.delete('/api/sector/:id', routeSector.delete);

        app.get("/api/state", routeState.getAll);

        app.get("/api/event/all/:amount", routeEvent.getAll);
        app.get("/api/event/sectorid/:id", routeEvent.getBySectorId);

        app.get('/api/iteration/latest', routeIteration.getLatestIteration);
    }
}