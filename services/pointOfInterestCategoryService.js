import PointOfInterestCategory from "../models/PointOfInterestCategory.js";

export default {
    getAllPointOfInterestCategories () {
        return new Promise((resolve, reject) => {
            PointOfInterestCategory.find({}).exec((err, pointOfInterestCategories) => { 
                if (err) {
                    reject(err);
                    return;
                }
                
                resolve(pointOfInterestCategories);
            });
        });
    }
}