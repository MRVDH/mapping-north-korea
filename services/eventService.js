import Event from "../models/Event.js";

export default {
    getAll (amount) {
        return new Promise((resolve, reject) => {
            Event.find({}).sort('-time').limit(parseInt(amount)).exec((err, events) => {
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