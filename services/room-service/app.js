require('dotenv').config();
const express = require("express");
const app = express();
const roomRoutes = require("./routes/roomRoutes");
const cors = require("cors");

app.use(cors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json());
app.use('/api/rooms', roomRoutes);

module.exports = app;