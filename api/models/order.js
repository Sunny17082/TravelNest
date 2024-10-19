const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    Place: {
        type: String,
        required: true
    },
    Price: {
        type: Number,
        required: true
    },
    Guests: {
        type: Number,
        required: true
    },
    room: {
        type: Number,
        required: true
    }
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;