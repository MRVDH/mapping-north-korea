import State from "../models/State.js";

export default {
    getAll () {
        return new Promise((resolve, reject) => {
            State.find({}, (err, states) => {
                if (err) {
                    reject(err);
                    return;
                }

                resolve(states);
            });
        });
    }
}