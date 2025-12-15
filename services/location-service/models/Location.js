const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const locationSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    address: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true,
    },
    lat: {
        type: Number,
    },
    lng: {
        type: Number,
    },
    country: {
        type: String,
        required: true
    },
    postcode: {
        type: String,
        required: true
    }
}, {
    timestamps: true
})

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;