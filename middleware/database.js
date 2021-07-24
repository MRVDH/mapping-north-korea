import mongoose from "mongoose";
import log from "../utils/log.js";

//import sectorImport from "../static/new_sectors.js";
//import regionsImport from "../static/nk_regions_simplified.js";
//import oldSectors from "./oldSectors.js";
//import oldEvents from "./oldEvents.js";

import Iteration from "../models/Iteration.js";
import SectorSet from "../models/SectorSet.js";
import State from "../models/State.js";
import Sector from "../models/Sector.js";
import Event from "../models/Event.js";

export default {
    async setUpDatabaseConnection () {
        mongoose.connect(global.mongodbConnection, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        });
        
        mongoose.connection.on("error", console.error.bind(console, 'connection error:'));

        mongoose.connection.once("open", async () => {
            log.suc("Connected to the MongoDB Atlas Cloud!");

            if (process.argv.includes("dev") && process.argv.includes("populate")) {
                log.alt("(RE)POPULATING THE DATABASE");
                // Don't forget to configure the populate function manually.
                await populate();
                log.alt("FINISHED (RE)POPULATING THE DATABASE");
            }

            if (process.argv.includes("dev") && process.argv.includes("mergeoldnew")) {
                log.alt("MERGING OLD AND NEW DATASET");
                await mergeOldNew();
                log.alt("FINISHED MERGING OLD AND NEW DATASET");
            }
        });
    },
    populate,
    async addRegions () {

    }
}

async function removeAllCollections() {
    log.alt("- Removing all collections...");
    var iterationtmp = new Iteration({ title: "dummy", start: new Date() });
    iterationtmp = await iterationtmp.save();
    var sectorSettmp = new SectorSet({ title: "dummy", iteration: iterationtmp });
    sectorSettmp = await sectorSettmp.save();
    var stateOpentmp = new State({ title: "dummy", color: "1" });
    stateOpentmp = await stateOpentmp.save();
    var sectortmp = new Sector({ sectorSet: sectorSettmp, state: stateOpentmp, coordinates: [[[1], [2]]] });
    sectortmp = await sectortmp.save();
    var eventtmp = new Event({ description: "dummy", sector: sectortmp, time: new Date(), osmUserId: 6651133, osmUserName: process.env.OSM_ADMIN_NAME });
    eventtmp = await eventtmp.save();

    Iteration.collection.drop();
    SectorSet.collection.drop();
    State.collection.drop();
    Sector.collection.drop();
    Event.collection.drop();
    mongoose.connection.db.dropCollection("sessions");
}

async function findOpenState() {
    log.alt("- Finding the open state...");

    var stateOpen = await State.find({ title: "Open" }).exec();
    return stateOpen[0];
}

async function addNewStates() {
    log.alt("- Adding the states...");
    var stateOpenTmp = new State({ title: "Open", color: "#FF0000" });
    stateOpenTmp = await stateOpenTmp.save();
    var stateEditing = new State({ title: "Being edited", color: "#145AF0" });
    stateEditing = await stateEditing.save();
    var stateReview = new State({ title: "Review needed", color: "#FFC60C" });
    stateReview = await stateReview.save();
    var stateCompleted = new State({ title: "Completed", color: "#008000" });
    stateCompleted = await stateCompleted.save();

    return stateOpenTmp;
}

async function findNewIteration() {
    log.alt("- Finding the new iteration...");
    var iteration = await Iteration.find({ title: "Roads 2020" }).exec();
    iteration = iteration[0];
    return iteration;
}

async function addNewIteration() {
    log.alt("- Adding the new iteration...");
    var iteration = new Iteration({ title: "Roads 2020", start: new Date() });
    iteration = await iteration.save();
    return iteration;
}

async function findNewSectorSets(iteration) {
    log.alt("- Finding the new sector sets...");
    return await SectorSet.find({ iteration: iteration }).exec();
}

async function addNewSectorSets(iteration) {
    log.alt("- Adding the new sector sets...");
    let newSectorSets = [];

    for (let feature of regionsImport.features) {
        let newSectorSet = new SectorSet({
            title: feature.properties.name,
            iteration,
            feature
        });

        newSectorSets.push(newSectorSet);
    }

    newSectorSets = await SectorSet.insertMany(newSectorSets);

    return newSectorSets;
}

async function findNewSectors(newSectorSets) {
    log.alt("- Finding the new sectors...");
    let allSectors = await Sector.find().exec();
    let newSectors = [];
    
    for (let set of newSectorSets) {
        let sectorsOfThisSet = allSectors.filter(x => x.sectorSet._id.toString() === set._id.toString());
        newSectors.push.apply(newSectors, sectorsOfThisSet);
    }

    return newSectors;
}

async function addNewSectors(newSectorSets, stateOpen) {
    log.alt("- Adding the new sectors...");
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

    return newSectors;
}

async function addCountsToSectorSets(newSectorSets, newSectors) {
    log.alt("- Adding the sector counts to the sector sets...");
    for (let set of newSectorSets) {
        let sectorsOfThisSet = newSectors.filter(x => x.sectorSet._id.toString() === set._id.toString());        
        await SectorSet.updateOne({ _id: set._id }, { totalCount: sectorsOfThisSet.length, completedCount: 0 });
    }
}

async function populate() {
    try {
        //await removeAllCollections();

        var iteration = await findNewIteration();
        //var iteration = await addNewIteration();

        var newSectorSets = await findNewSectorSets(iteration);
        //var newSectorSets = await addNewSectorSets(iteration);
        
        //var stateOpen = await findOpenState();
        //var stateOpen = await addNewStates();

        var newSectors = await findNewSectors(newSectorSets);
        //var newSectors = await addNewSectors(newSectorSets, stateOpen);

        await addCountsToSectorSets(newSectorSets, newSectors);
    } catch (err) {
        console.log('err', err);
    }
}

function isPointInPolygon(point, polygon) {
    // ray-casting algorithm based on
    // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    
    var x = point[0], y = point[1];
    
    var inside = false;
    for (var i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        var xi = polygon[i][0], yi = polygon[i][1];
        var xj = polygon[j][0], yj = polygon[j][1];
        
        var intersect = ((yi > y) != (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    
    return inside;
}

async function mergeOldNew() {
    // get all new sectors
    log.alt("- Finding sectors and sector sets...");
    var newSectorSets = await SectorSet.find().exec();
    var newSectors = await Sector.find().exec();

    // loop over new sectors
    log.alt("- Updating sectors...");
    for (let sector of newSectors) {
        // get the center of the section
        let minx = 9999999;
        let miny = 9999999;
        let maxx = 0;
        let maxy = 0;

        for (let coordSet of sector.coordinates[0]) {
            if (coordSet[0] < minx) minx = coordSet[0];
            if (coordSet[1] < miny) miny = coordSet[1];
            if (coordSet[0] > maxx) maxx = coordSet[0];
            if (coordSet[1] > maxy) maxy = coordSet[1];
        }

        let centerx = minx + ((maxx - minx) / 2);
        let centery = miny + ((maxy - miny) / 2);

        for (let oldSector of oldSectors) {
            if (isPointInPolygon([ centerx, centery ], oldSector.coordinates[0])) {
                if (oldSector.state.$oid !== '5c93aeba02ed1b2be46dbc12') { // If it's not open
                    await Sector.updateOne({ _id: sector._id }, { state: oldSector.state.$oid === "5c93aebb02ed1b2be46dbc16" ? "5c93aebb02ed1b2be46dbc14" : oldSector.state.$oid });
                    let events = oldEvents.filter(x => x.sector.$oid === oldSector._id.$oid && x.description !== "Sector created");

                    let eventsToInsert = [];
                    for (let event of events) {
                        eventsToInsert.push({
                            description: event.description,
                            sector: sector._id,
                            time: event.time.$date,
                            osmUserId: event.osmUserId,
                            osmUserName: event.osmUserName
                        });
                    }

                    if (eventsToInsert.length) {
                        await Event.insertMany(eventsToInsert);
                    }
                }
                break;
            }
        }
    }

    await addCountsToSectorSets(newSectorSets, newSectors);
}