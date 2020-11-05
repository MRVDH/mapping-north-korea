import mongoose from "mongoose";

import sectorImport from "../static/sectors-import.js";

import Iteration from "../models/Iteration.js";
import SectorSet from "../models/SectorSet.js";
import State from "../models/State.js";
import Sector from "../models/Sector.js";
import Event from "../models/Event.js";

export default {
    run: async function (options) {
        try {
            if (options && options.removeCollections) {
                var iterationtmp = new Iteration({ title: "Initial mapping 2019", start: new Date() });
                iterationtmp = await iterationtmp.save();
                var sectorSettmp = new SectorSet({ title: "North Korea", iteration: iterationtmp });
                sectorSettmp = await sectorSettmp.save();
                var stateOpentmp = new State({ title: "Open", color: "1" });
                stateOpentmp = await stateOpentmp.save();
                var sectortmp = new Sector({ sectorSet: sectorSettmp, state: stateOpentmp, coordinates: [[[1], [2]]] });
                sectortmp = await sectortmp.save();
                var eventtmp = new Event({ description: "Sector created", sector: sectortmp, time: new Date(), osmUserId: 6651133, osmUserName: process.env.OSM_ADMIN_NAME });
                eventtmp = await eventtmp.save();
                Iteration.collection.drop();
                SectorSet.collection.drop();
                State.collection.drop();
                Sector.collection.drop();
                Event.collection.drop();
                if (!options.keepSessions) mongoose.connection.db.dropCollection("sessions");
            }

            var iteration = new Iteration({ title: "Initial mapping 2019", start: new Date() });
            iteration = await iteration.save();
            
            var stateOpen = new State({ title: "Open", color: "#FF0000" });
            stateOpen = await stateOpen.save();
            var stateEditing = new State({ title: "Being edited", color: "#145AF0" });
            stateEditing = await stateEditing.save();
            var stateReview = new State({ title: "Review needed", color: "#FFC60C" });
            stateReview = await stateReview.save();
            var stateCompleted = new State({ title: "Completed", color: "#008000" });
            stateCompleted = await stateCompleted.save();

            var sectorSet = new SectorSet({ title: "North Korea", iteration: iteration });
            sectorSet = await sectorSet.save();

            // import all sectors, loop over each sector, add data to the schema, await save.
            for (var sector of sectorImport.features) {
                var sect = new Sector({
                    sectorSet: sectorSet,
                    state: stateOpen,
                    coordinates: sector.geometry.coordinates
                });
                sect.save().then((newSect) => {
                    new Event({
                        description: "Sector created",
                        sector: newSect,
                        time: new Date(),
                        osmUserId: 6651133,
                        osmUserName: process.env.OSM_ADMIN_NAME
                    }).save();
                });
            }
        } catch (err) {
            console.log('err', err);
        }
    }
}