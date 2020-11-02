var mongoose = require("mongoose");

module.exports = mongoose.model("Event", new mongoose.Schema({
    description: { type: String, required: true },
    sector: { type: mongoose.Schema.Types.ObjectId, ref: "Sector", required: true },
    time: { type: Date, required: true },
    osmUserId: { type: String, required: true },
    osmUserName: { type: String, required: true }
}));