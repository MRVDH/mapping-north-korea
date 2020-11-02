var mongoose = require("mongoose");

module.exports = mongoose.model("SectorSet", new mongoose.Schema({
    title: { type: String, required: true },
    iteration: { type: mongoose.Schema.Types.ObjectId, ref: "Iteration", required: true }
}));