const cors = require("cors");
const express = require("express");
const userRoutes = require("./routes/userRoutes");
const app = express();

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

app.use((req, res, next) => {
    console.log('Body (after JSON parse):', req.body);
    next();
});

app.use('/api/auth', userRoutes);

module.exports = app;