const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
	{
		place: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Place",
			required: true,
		},
		rating: {
			type: Number, required:
			true, min: 1, max: 5
		},
		comment: {
			type: String,
			required: true
		},
		user: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		createdAt: {
			type: Date,
			default: Date.now
		},
	},
);

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;