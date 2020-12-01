import PointOfInterest from "../models/PointOfInterest.js";
import PointOfInterestLike from "../models/PointOfInterestLike.js";

export default {
    getAllPointOfInterests () {
        return new Promise((resolve, reject) => {
            PointOfInterest.find({}).populate({
                path: "likes"
            }).exec((err, pointOfInterests) => { 
                if (err) {
                    reject(err);
                    return;
                }

                pointOfInterests = pointOfInterests.sort((first, second) => { return first.likes.length - second.likes.length });

                resolve(pointOfInterests);
            });
        });
    }
}