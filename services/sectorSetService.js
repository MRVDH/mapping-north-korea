import SectorSet from "../models/SectorSet.js";
import Sector from "../models/Sector.js";

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

                    if (percentage < 25) {
                        color = "#FF0000";
                    } else if (percentage < 50) {
                        color = "#FF7F00";
                    } else if (percentage < 75) {
                        color = "#145AF0";
                    } else {
                        color = "#008000";
                    }

                    set.feature.properties._percentage = percentage;
                    set.feature.properties._color = color;
                    set.feature.properties._title = set.title;
                    set.feature.properties._id = set._id;
                }

                sectorSets.sort((a, b) => b._percentage - a._percentage);

                resolve(sectorSets);
            });
        });
    }
}