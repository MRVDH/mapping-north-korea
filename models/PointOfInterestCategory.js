import mongoose from "mongoose";

export default mongoose.model("PointOfInterestCategory", new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: false }
}));