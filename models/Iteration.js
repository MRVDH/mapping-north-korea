import mongoose from "mongoose";

export default mongoose.model("Iteration", new mongoose.Schema({
    title: { type: String, required: true },
    start: { type: Date, required: true },
}));