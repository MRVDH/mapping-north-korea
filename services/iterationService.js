import Iteration from "../models/Iteration.js";

export default {
    getLatestIteration () {
        return new Promise((resolve, reject) => {
            Iteration.find({}).sort('-start').exec(function (err, iterations) { 
                if (err) {
                    reject(err);
                    return;
                }

                resolve(iterations[0]);
            });
        });
    }
}