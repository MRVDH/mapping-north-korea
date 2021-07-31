import PointOfInterestCategory from "../models/PointOfInterestCategory.js";

export default {
    getAllPointOfInterestCategories () {
        return new Promise((resolve, reject) => {
            PointOfInterestCategory.find({}).exec((err, pointOfInterestCategories) => { 
                if (err) {
                    reject(err);
                    return;
                }

                const finalPointOfInterestCategories = pointOfInterestCategories.sort((a, b) => {
                    var nameA = a.title.toUpperCase();
                    var nameB = b.title.toUpperCase();

                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                  
                    return 0;
                });

                resolve(finalPointOfInterestCategories);
            });
        });
    }
}