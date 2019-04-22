var mongoose = require("mongoose");

module.exports = mongoose.model("Iteration", new mongoose.Schema({
    title: { type: String, required: true },
    start: { type: Date, required: true },
}));