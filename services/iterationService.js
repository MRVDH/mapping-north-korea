import Iteration from "../models/Iteration.js";

export default {
    getCurrentIteration () {
        return new Promise((resolve, reject) => {
            Iteration.find({}).sort('-start').limit(1).exec(function (err, iterations) { 
                if (err) {
                    reject(err);
                    return;
                }

                resolve(iterations[0]);
            });
        });
    }
}