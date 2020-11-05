import mongoose from "mongoose";

export default mongoose.model("Sector", new mongoose.Schema({
    sectorSet: { type: mongoose.Schema.Types.ObjectId, ref: "SectorSet", required: true },
    state: { type: mongoose.Schema.Types.ObjectId, ref: "State", required: true },
    coordinates: { type: [[[ Number ]]], required: true }
}));