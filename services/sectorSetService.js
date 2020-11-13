import SectorSet from "../models/SectorSet.js";
import Sector from "../models/Sector.js";
import State from "../models/State.js";

export default {
    getAllSectorSetsByIterationId (iterationId) {
        return new Promise((resolve, reject) => {
            SectorSet.find({ iteration: iterationId }).exec((err, sectorSets) => {
                if (err) {
                    reject(err);
                    return;
                }

                for (let set of sectorSets) {
                    let percentage = (100 * set.completedCount) / set.totalCount;
                    let color = "";

                    if (percentage === 100) {
                        color = "#008000";
                    } else {
                        let end = 100;
                        let start = 15;
                        let a = percentage / 100;
                        let b = (end - start) * a;
                        let hue = Math.ceil(b + start);
                  
                        color = `hsl(${hue}, 100%, 50%)`;
                    }

                    set.feature.properties._percentage = percentage;
                    set.feature.properties._color = color;
                    set.feature.properties._title = set.title;
                    set.feature.properties._id = set._id;
                }

                sectorSets.sort((a, b) => b.feature.properties._percentage - a.feature.properties._percentage);

                resolve(sectorSets);
            });
        });
    },
    recountSectorSetCounts (id) {
        return new Promise(async (resolve, reject) => {
            try {
                var doneState = await State.find({ title: 'Completed' });

                let amountOfCompletedSectors = await Sector.countDocuments({ sectorSet: id, state: doneState }).exec();

                SectorSet.update({ _id: id }, { completedCount: amountOfCompletedSectors }).exec();

                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }
}