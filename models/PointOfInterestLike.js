import mongoose from "mongoose";

export default mongoose.model("PointOfInterestLike", new mongoose.Schema({
    osmUserId: { type: String, required: true },
    osmUserName: { type: String, required: true },
    pointOfInterest: { type: mongoose.Schema.Types.ObjectId, ref: "PointOfInterest", required: true }
}));