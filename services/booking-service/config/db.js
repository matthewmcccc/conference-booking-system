require('dotenv').config();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URL;

mongoose.connect(url)
    .then(() => {
        console.log("connected to mongoDB")
    })
    .catch((err) => {
        console.error(`Error connecting to mongoDB: ${err}`);
    })

module.exports = mongoose;