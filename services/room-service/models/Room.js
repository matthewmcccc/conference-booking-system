const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const roomSchema = new Schema({
    base_price: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    capacity: {
        type: Number,
        required: true
    }
}, { timestamps: true })

const Room = mongoose.model("Room", roomSchema);

module.exports = Room;