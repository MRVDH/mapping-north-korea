import mongoose from "mongoose";

export default mongoose.model("SectorSet", new mongoose.Schema({
    title: { type: String, required: true },
    iteration: { type: mongoose.Schema.Types.ObjectId, ref: "Iteration", required: true },
    feature: { type: Object, required: false }
}));