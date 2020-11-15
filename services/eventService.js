import Event from "../models/Event.js";

export default {
    add (sectorId, description, osmUserId, osmUserName) {
        return new Promise(async (resolve, reject) => {
            try {
                let newEvent = new Event({
                    description: description,
                    sector: sectorId,
                    time: new Date(),
                    osmUserId: osmUserId,
                    osmUserName: osmUserName
                });

                newEvent = await newEvent.save();
                resolve(newEvent);
            } catch (err) {
                reject(err);
            }
        });
    },
    getAll (amount) {
        return new Promise((resolve, reject) => {
            Event.find({}).populate({
                path: "sector"
            }).sort('-time').limit(parseInt(amount)).exec((err, events) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(events);
            });
        });
    },
    getBySectorId (sectorId) {
        return new Promise((resolve, reject) => {
            Event.find({ sector: sectorId }, (err, events) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(events);
            });
        });
    }
}