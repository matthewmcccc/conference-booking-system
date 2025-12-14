const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const bookingSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true
    },
    room: {
        type: Schema.Types.ObjectId,
        ref: "Room",
        required: true,
        index: true
    },
    date: {
        type: Date,
        required: true
    },
    base_price: {
        type: Number,
        required: true
    },
    weather_adjustment: {
        type: Number,
        required: true
    },
    total_price: {
        type: Number,
        required: true
    }
}, {timestamps: true});

const Booking = mongoose.model("Booking", bookingSchema);

module.exports = Booking;