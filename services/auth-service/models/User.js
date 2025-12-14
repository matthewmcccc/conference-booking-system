const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    email: {
        type: String,
        required: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    first_name: {
        type: String,
        required: true
    },
    surname: {
        type: String,
        required: true
    }
}, { timestamps: true });

const User = mongoose.model("User", userSchema);

module.exports = User;