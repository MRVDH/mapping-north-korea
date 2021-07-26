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
    },
    addPointOfInterest (title, description, longitude, latitude, categories, osmUserId, osmUserName) {
        return new Promise(async (resolve, reject) => {
            try {
                let newPoi = new PointOfInterest({
                    title,
                    description,
                    osmUserId,
                    osmUserName,
                    longitude,
                    latitude,
                    time: new Date(),
                    categories: categories.map(x => x._id),
                    likes: []
                });

                newPoi = await newPoi.save();
                
                resolve(newPoi);
            } catch (err) {
                reject(err);
            }
        });
    },
    deletePointOfInterest (id) {
        return new Promise(async (resolve, reject) => {
            try {
                await PointOfInterestLike.deleteMany({ pointOfInterest: id })
                await PointOfInterest.deleteOne({ _id: id }).exec();
                
                resolve();
            } catch (err) {
                reject(err);
            }
        });
    }
}