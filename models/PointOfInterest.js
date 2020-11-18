import mongoose from "mongoose";

export default mongoose.model("PointOfInterest", new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    longitude: { type: Number, ref: "Sector", required: true },
    latitude: { type: Date, required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "PointOfInterestLike", required: true }]
}));