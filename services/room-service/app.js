require('dotenv').config();
const express = require("express");
const app = express();
const roomRoutes = require("./routes/roomRoutes");
const cors = require("cors");

app.use(cors({
    origin: [
        'http://localhost',
        'http://localhost:80', 
        'http://localhost:8080',
        'http://conference-room-loadbalancer-1421121313.eu-west-1.elb.amazonaws.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))
app.use(express.json());
app.use('/api/rooms', roomRoutes);

module.exports = app;