import PointOfInterest from "../models/PointOfInterest.js";
import PointOfInterestLike from "../models/PointOfInterestLike.js";

export default {
    getById (id, currentUserId, currentUserName) {
        return new Promise(async (resolve, reject) => {
            try {
                let pointOfInterest = await PointOfInterest.findById(id);

                const likeCount = await PointOfInterestLike.countDocuments({ pointOfInterest: id }).exec();
                const likedByCurrentUser = currentUserId && currentUserName && await PointOfInterestLike.exists({ pointOfInterest: id, osmUserId: currentUserId, osmUserName: currentUserName });

                const finalPointOfInterest = {
                    categories: pointOfInterest.categories,
                    _id: pointOfInterest._id,
                    title: pointOfInterest.title,
                    description: pointOfInterest.description,
                    time: pointOfInterest.time,
                    longitude: pointOfInterest.longitude,
                    latitude: pointOfInterest.latitude,
                    likeCount,
                    likedByCurrentUser
                };

                resolve(finalPointOfInterest);
            } catch (err) {
                reject(err);
            }
        });
    },
    getAllPointOfInterests (currentUserId, currentUserName) {
        return new Promise(async (resolve, reject) => {
            try {
                const pointOfInterests = await PointOfInterest.find({}).exec();

                let finalPointOfInterests = [];

                for (let poi of pointOfInterests) {
                    const likeCount = await PointOfInterestLike.countDocuments({ pointOfInterest: poi._id }).exec();
                    const likedByCurrentUser = currentUserId && currentUserName && await PointOfInterestLike.exists({ pointOfInterest: poi._id.toString(), osmUserId: currentUserId, osmUserName: currentUserName });

                    finalPointOfInterests.push({
                        categories: poi.categories,
                        _id: poi._id,
                        title: poi.title,
                        description: poi.description,
                        time: poi.time,
                        longitude: poi.longitude,
                        latitude: poi.latitude,
                        likeCount,
                        likedByCurrentUser
                    });
                }

                finalPointOfInterests = finalPointOfInterests.sort((first, second) => second.likeCount - first.likeCount);

                resolve(finalPointOfInterests);
            } catch (err) {
                reject(err);
            }
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
    updatePointOfInterest (poi) {
        return new Promise(async (resolve, reject) => {
            try {
                await PointOfInterest.findOneAndUpdate({ _id: poi._id }, poi);
                resolve(poi);
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