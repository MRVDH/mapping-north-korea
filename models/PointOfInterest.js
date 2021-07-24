import mongoose from "mongoose";

export default mongoose.model("PointOfInterest", new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false },
    osmUserId: { type: String, required: true },
    osmUserName: { type: String, required: true },
    longitude: { type: String, required: true },
    latitude: { type: String, required: true },
    time: { type: Date, required: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: "PointOfInterestCategory", required: true }],
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "PointOfInterestLike", required: true }]
}));