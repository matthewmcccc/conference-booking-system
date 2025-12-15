
require('dotenv').config();
require('./config/db');

const express = require("express");
const locationRoutes = require("./routes/locationRoutes");
const PORT = process.env.PORT || 8081;

const app = express();

app.use(express.json());

app.use('/api/locations', locationRoutes);

app.listen(PORT, () => {
    console.log(`Location service running on: ${PORT}`);
})