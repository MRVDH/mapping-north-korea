import log from "./utils/log.js";
log.inf("Loading packages and middleware...");

import express from "express"; 
import bodyParser from "body-parser";
import environment from "./middleware/environment.js";
import database from "./middleware/database.js";
import request from "./middleware/request.js";
import routing from "./middleware/routes.js";

(async () => {
    log.inf("Configuring middleware...");

    const __dirname = await environment.getDirName();

    await environment.validateEnvironmentVariables();
    await environment.setGlobalVariables(__dirname);
    await database.setUpDatabaseConnection();

    const app = express();

    app.use(request.cors);
    app.enable("trust proxy");
    app.use("/api/", request.rateLimit());
    app.use(request.session());
    app.use(express.static(__dirname + "/dist"));
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());
    app.use(request.filterNonApiRequests(__dirname));
    app.use(request.log);

    log.inf("Setting up routing...");
    await routing.setUpRouting(app);

    log.inf("App setup finish. Starting server...");
    app.listen(global.port, _ => log.suc("Server running on port " + port));
})();