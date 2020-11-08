import mongoose from "mongoose";
import log from "../utils/log.js";

import sectorImport from "../static/new_sectors.js";
import regionsImport from "../static/nk_regions_simplified.js";

import Iteration from "../models/Iteration.js";
import SectorSet from "../models/SectorSet.js";
import State from "../models/State.js";
import Sector from "../models/Sector.js";
import Event from "../models/Event.js";

export default {
    async setUpDatabaseConnection () {
        mongoose.connect(global.mongodbConnection, {
            useNewUrlParser: true
        });
        
        mongoose.connection.on("error", console.error.bind(console, 'connection error:'));

        mongoose.connection.once("open", async () => {
            log.suc("Connected to the MongoDB Atlas Cloud!");

            if (process.argv.includes("dev") && process.argv.includes("populate")) {
                log.alt("(RE)POPULATING THE DATABASE");
                await populate({
                    removeCollections: false,
                    keepSessions: false
                });
                log.alt("FINISHED (RE)POPULATING THE DATABASE");
            }
        });
    },
    populate,
    async addRegions () {

    }
}

async function populate(options) {
    try {
        if (!options) {
            throw "no options object given.";
        }

        if (options.removeCollections) {
            // Collections need to exist before they can be dropped. Therefore, we insert demo data just in case.
            var iterationtmp = new Iteration({ title: "Roads 2020", start: new Date() });
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

            if (!options.keepSessions) {
                mongoose.connection.db.dropCollection("sessions");
            }
        }

        var iteration = await Iteration.find({ title: "Roads 2020" }).exec();
        iteration = iteration[0];

        // var iteration = new Iteration({ title: "Roads 2020", start: new Date() });
        // iteration = await iteration.save();
        
        // if (options.removeCollections) {
        //     var stateOpenTmp = new State({ title: "Open", color: "#FF0000" });
        //     stateOpenTmp = await stateOpenTmp.save();
        //     var stateEditing = new State({ title: "Being edited", color: "#145AF0" });
        //     stateEditing = await stateEditing.save();
        //     var stateReview = new State({ title: "Review needed", color: "#FFC60C" });
        //     stateReview = await stateReview.save();
        //     var stateCompleted = new State({ title: "Completed", color: "#008000" });
        //     stateCompleted = await stateCompleted.save();
        // }

        var stateOpen = await State.find({ title: "Open" }).exec();
        stateOpen = stateOpen[0];

        let newSectorSets = [];

        newSectorSets = await SectorSet.find({ iteration: iteration }).exec();

        //console.log(iteration);
        //console.log(stateOpen);
        //console.log(newSectorSets.length, regionsImport.features.length);

        // for (let feature of regionsImport.features) {
        //     let newSectorSet = new SectorSet({
        //         title: feature.properties.name,
        //         iteration,
        //         feature
        //     });

        //     await newSectorSet.save();
        //     newSectorSets.push(newSectorSet);
        // }
    
        // var newSectorSetIds = [];

        // for (let ss of newSectorSets) {
        //     newSectorSetIds.push(ss._id);
        // }

        // console.log(await Sector.find({ sectorSet: { "$in": newSectorSetIds } }).exec());

        // return;

        var newSectors = [];

        for (let sectorSet of newSectorSets) {
            let featuresOfThisSet = sectorImport.features.filter(x => x.properties.name === sectorSet.title);

            for (let feature of featuresOfThisSet) {
                var newSector = new Sector({
                    sectorSet,
                    state: stateOpen,
                    coordinates: feature.geometry.coordinates[0]
                });

                newSectors.push(newSector);
            }
        }

        newSectors = await Sector.insertMany(newSectors);

        var newEvents = [];

        for (let newSector of newSectors) {
            var newEvent = new Event({
                description: "Sector created",
                sector: newSector._id,
                time: new Date(),
                osmUserId: 6651133,
                osmUserName: process.env.OSM_ADMIN_NAME
            });

            newEvents.push(newEvent);
        }

        newEvents = await Event.insertMany(newEvents);
    } catch (err) {
        console.log('err', err);
    }
}