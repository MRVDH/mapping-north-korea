import mongoose from "mongoose";
import log from "../utils/log.js";

export default {
    async setUpDatabaseConnection () {
        mongoose.connect(global.mongodbConnection, {
            useNewUrlParser: true
        });
        
        mongoose.connection.on("error", console.error.bind(console, 'connection error:'));

        mongoose.connection.once("open", function() {
            log.suc("Connected to the MongoDB Atlas Cloud!");

            if (process.argv.includes("dev") && process.argv.includes("resetdb")) {
                log.alt("(RE)POPULATING THE DATABASE");
                require("../utils/populateDb.js").run({
                    removeCollections: true,
                    keepSessions: false
                });
            }
        });
    }
}