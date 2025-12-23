require('dotenv').config();
const mongoose = require("mongoose");

const url = process.env.MONGODB_URL;
const dbName = process.env.MONGODB_DB;

mongoose.connect(url, { dbName })
    .then(() => {
        console.log(`connected to mongoDB (${dbName})`);
    })
    .catch((err) => {
        console.error(`Error connecting to mongoDB: ${err}`);
    });

module.exports = mongoose;
