import SectorSet from "../models/SectorSet.js";
import State from "../models/State.js";
import Sector from "../models/Sector.js";
import Event from "../models/Event.js";

export default {
    getAll () {
        return new Promise((resolve, reject) => {
            Sector.find({}).populate({
                path: "sectorSet",
                populate: {
                    path: "iteration"
                }
            }).populate({
                path: "state"
            }).exec((err, sectors) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(sectors);
            });
        });
    },
    getBySectorSetId (sectorSetId) {
        return new Promise((resolve, reject) => {
            Sector.find({ sectorSet: sectorSetId }).populate({
                path: "state"
            }).exec((err, sectors) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(sectors);
            });
        });
    },
    async update (id, sector, state, osmUserId, osmUserName) {
        return new Promise(async (resolve, reject) => {
            let responseObject = {
                sector,
                event: null
            };

            // Don't do anything if there is no new state.
            if (sector.state._id === state._id) {
                resolve(responseObject);
                return;
            }

            // Set new state and update.
            sector.state = state;

            Sector.findOneAndUpdate({ _id: id }, sector, async (err) => {
                if (err) {
                    reject(err);
                    return;
                }

                var newEventState = new Event({
                    description: "State changed to " + sector.state.title,
                    sector,
                    time: new Date(),
                    osmUserId,
                    osmUserName
                });

                newEventState = await newEventState.save();

                responseObject.event = newEventState;

                resolve(responseObject);
            });
        });
    },
    generateGpxBySectorId (id) {
        return new Promise((resolve, reject) => {
            Sector.findById(id, (err, sector) => {
                if (err) {
                    reject(err);
                    return;
                }

                var trackPoints = "";
                var wayPoints = "";

                for (var coord of sector.coordinates[0]) {
                    trackPoints += `<trkpt lat="${coord[1]}" lon="${coord[0]}" />`;
                    wayPoints += `<wpt lat="${coord[1]}" lon="${coord[0]}" />`;
                }

                var xmlString = `
                    <?xml version="1.0" encoding="utf8"?>
                    <gpx creator="MappingNorthKorea.com" version="1.1" xmlns="http://www.topografix.com/GPX/1/1">
                        <metadata>
                            <link href="https://www.mappingnorthkorea.com/">
                                <text>Mapping North Korea</text>
                            </link>
                            <time>${new Date().toISOString().slice(0, -1)}</time>
                        </metadata>
                        <trk>
                            <name>Sector ${id}. Do not edit outside of this area!</name>
                            <trkseg>
                                ${trackPoints}
                            </trkseg>
                        </trk>
                        ${wayPoints}
                    </gpx>`;

                resolve(xmlString);
            });
        });
    },
    async getCompletedSectorCountByIterationId (id) {
        return new Promise((resolve, reject) => {
            SectorSet.find({ iteration: id }, async (err, sectorSets) => {
                if (err) {
                    reject(err);
                    return;
                }
    
                var doneState = await State.find({ title: 'Completed' });
    
                var totalCount = 0;
                var doneCount = 0;

                for (var sectorSet of sectorSets) {
                    totalCount += await Sector.countDocuments({ sectorSet: sectorSet._id });
                    doneCount += await Sector.countDocuments({ sectorSet: sectorSet._id, state: doneState[0]._id });
                }

                resolve({
                    totalCount,
                    doneCount
                });
            });
        });
    },
    delete (id) {
        return new Promise((resolve, reject) => {
            Sector.deleteOne({ _id: id }, (err) => {
                if (err) {
                    reject(err);
                    return;
                }
    
                Event.deleteMany({ sector: id }, (err1) => {
                    if (err1) {
                        reject(err);
                        return;
                    }

                    resolve(true);
                });
            });
        });
    },
    splitSectorBySectorId (id) {
        return new Promise((resolve, reject) => {
            Sector.find({ _id: id }, (err, results) => {
                if (err) {
                    reject(err);
                    return;
                }

                if (!results.length) {
                    resolve(null);
                    return;
                }

                var originalSector = results[0];
    
                var coordinates = originalSector.coordinates[0];
    
                // ostl = original sector top left
                var ostl = coordinates[0];
                var ostr = coordinates[1];
                var osbr = coordinates[2];
                var osbl = coordinates[3];
    
                // lat = x, lng = y
                var ostllat = ostl[0];
                var ostllng = ostl[1];
                var ostrlat = ostr[0];
                var ostrlng = ostr[1];
                var osbrlat = osbr[0];
                var osbrlng = osbr[1];
                var osbllat = osbl[0];
                var osbllng = osbl[1];
    
                // ncm = new coordinate middle
                var ncmlat = (ostllat + ostrlat) / 2;
                var ncmlng = (ostllng + osbllng) / 2;
    
                var sectorsCoords = [[
                    [ostllat, ostllng],
                    [ncmlat, (ostllng + ostrlng) / 2],
                    [ncmlat, ncmlng],
                    [(ostllat + osbllat) / 2, ncmlng],
                    [ostllat, ostllng]
                ], [
                    [ncmlat, (ostllng + ostrlng) / 2],
                    [ostrlat, ostrlng],
                    [(ostrlat + osbrlat) / 2, ncmlng],
                    [ncmlat, ncmlng],
                    [ncmlat, (ostllng + ostrlng) / 2]
                ], [
                    [ncmlat, ncmlng],
                    [(osbrlat + ostrlat) / 2, ncmlng],
                    [osbrlat, osbrlng],
                    [ncmlat, (osbrlng + osbllng) / 2],
                    [ncmlat, ncmlng]
                ], [
                    [(ostllat + osbllat) / 2, ncmlng],
                    [ncmlat, ncmlng],
                    [ncmlat, (osbllng + osbrlng) / 2],
                    [osbllat, osbllng],
                    [(ostllat + osbllat) / 2, ncmlng]
                ]];
    
                var newSectors = [];

                for (var i = 0; i < 4; i++) {
                    newSectors.push({
                        coordinates: [ sectorsCoords[i] ],
                        state: originalSector.state,
                        sectorSet: originalSector.sectorSet
                    });
                }
    
                Sector.create(newSectors, (err, uploadedSectors) => {
                    if (err) {
                        reject(err);
                        return;
                    }
    
                    Event.find({ sector: originalSector._id }, (err1, events) => {
                        if (err1) {
                            reject(err1);
                            return;
                        }
    
                        var eventsToUpload = [];
    
                        for (var uploadedSector of uploadedSectors) {
                            for (var event of events) {
                                eventsToUpload.push({
                                    description: event.description,
                                    sector: uploadedSector._id.toString(),
                                    time: event.time,
                                    osmUserId: event.osmUserId,
                                    osmUserName: event.osmUserName
                                });
                            }
                        }
    
                        Event.create(eventsToUpload, (err2, uploadedEvents) => {
                            if (err2) {
                                reject(err2);
                                return;
                            }
    
                            Sector.deleteOne({ _id: originalSector._id }, (err3) => {
                                if (err3) {
                                    reject(err3);
                                    return;
                                }
    
                                resolve({
                                    originalSector,
                                    newSectors: uploadedSectors
                                });
                            });
                        });
                    });
                });
            });
        });
    }
}