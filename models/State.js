import mongoose from "mongoose";

export default mongoose.model("State", new mongoose.Schema({
    title: { type: String, required: true },
    color: { type: String, required: true }
}));