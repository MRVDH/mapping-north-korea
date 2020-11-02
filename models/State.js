var mongoose = require("mongoose");

module.exports = mongoose.model("State", new mongoose.Schema({
    title: { type: String, required: true },
    color: { type: String, required: true }
}));