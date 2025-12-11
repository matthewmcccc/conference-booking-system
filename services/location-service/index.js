require('dotenv').config();
const express = require("express");
require('./config/db');
const locationRoutes = require("./routes/locationRoutes");
const PORT = 8081;

const app = express();

app.use(express.json());
app.use('/api/locations', locationRoutes);


app.listen(PORT, () => {
    console.log(`Location service running on port: ${PORT}`);
})