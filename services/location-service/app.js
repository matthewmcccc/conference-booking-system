
require('dotenv').config();
const express = require("express");
const locationRoutes = require("./routes/locationRoutes");

const app = express();

app.use(express.json());
app.use('/api/locations', locationRoutes);

module.exports = app