const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
	bookingId: String,
	place: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Place",
	},
	user: { type: mongoose.Schema.Types.ObjectId, required: true },
	checkIn: { type: Date, required: true },
	checkOut: { type: Date, required: true },
	name: { type: String, required: true },
	phone: { type: String, required: true },
	numberOfGuests: { type: Number, required: true },
	price: Number,
	paymentStatus: {
		type: String,
		enum: ["pending", "completed"],
		default: "pending",
	},
});

const Booking = mongoose.model("Booking", bookingSchema);
module.exports = Booking;