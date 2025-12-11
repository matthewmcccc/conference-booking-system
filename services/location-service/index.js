require('dotenv').config();
const express = require("express");
require('./config/db');
const locationRoutes = require("./routes/locationRoutes");

const app = express();

app.use(express.json());
app.use('/api/locations', locationRoutes);

const port = 3000;

app.listen(port, () => {
    console.log(`Location service running on port: ${port}`);
})