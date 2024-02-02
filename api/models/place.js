const mongoose = require("mongoose");

const placeSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    title: String,
    address: String,
    photos: [String],
    description: String,
    perks: [String],
    extrainfo: String,
    checkIn: Number,
    checkOut: Number,
    maxGusets: Number
});

const placeModel = mongoose.model("Place", placeSchema);
module.exports = placeModel;