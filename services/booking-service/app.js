const bookingRoutes = require("./routes/bookingRoutes");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors({
    origin: [
        'http://localhost',
        'http://localhost:80',
        'http://localhost:8080',
        'http://52.17.242.229',
        'http://conference-room-loadbalancer-1421121313.eu-west-1.elb.amazonaws.com'
    ],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}))

app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
app.use("/api/bookings", bookingRoutes);

module.exports = app;