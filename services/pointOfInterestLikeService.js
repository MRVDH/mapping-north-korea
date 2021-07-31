import PointOfInterest from "../models/PointOfInterest.js";
import PointOfInterestLike from "../models/PointOfInterestLike.js";

export default {
    likePointOfInterest (id, osmUserId, osmUserName) {
        return new Promise(async (resolve, reject) => {
            try {
                const pointOfInterestLike = await PointOfInterestLike.findOne({ pointOfInterest: id, osmUserId, osmUserName }).exec();

                if (pointOfInterestLike) {
                    await PointOfInterestLike.deleteOne({ _id: pointOfInterestLike._id });
                    resolve();
                } else {
                    let poiLike = new PointOfInterestLike({
                        osmUserId,
                        osmUserName,
                        time: new Date(),
                        pointOfInterest: id
                    });

                    poiLike = await poiLike.save();
                    resolve();
                }
            } catch (err) {
                reject(err);
            }
        });
    }
}