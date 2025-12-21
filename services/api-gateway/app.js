require("dotenv").config();
const express = require("express");
const axios = require("axios");
const app = express();
const PORT = process.env.PORT || 8086;
const cors = require('cors');

app.use(cors());
app.use(express.json());

const WEATHER_SERVICE_URL = process.env.WEATHER_SERVICE_URL || 'http://weather-service:8080'
const LOCATION_SERVICE_URL = process.env.LOCATION_SERVICE_URL ||  'http://location-service:8081'
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://auth-service:8084"
const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || "http://booking-service:8085"
const ROOM_SERVICE_URL = process.env.ROOM_SERVICE_URL || "http://room-service:8083"

app.use('/api', async (req, res) => {
    try {
        const path = req.path;
        
        let targetUrl;
        
        if (path.startsWith('/auth')) {
            targetUrl = `${AUTH_SERVICE_URL}/api${path}`;
        } else if (path.startsWith('/locations')) {
            targetUrl = `${LOCATION_SERVICE_URL}/api${path}`;
        } else if (path.startsWith('/weather')) {
            targetUrl = `${WEATHER_SERVICE_URL}/api${path}`;
        } else if (path.startsWith('/bookings')) {
            targetUrl = `${BOOKING_SERVICE_URL}/api${path}`;
        } else if (path.startsWith('/rooms')) {
            targetUrl = `${ROOM_SERVICE_URL}/api${path}`;
        } else {
            return res.status(404).json({ error: 'Route not found' });
        }

        const response = await axios({
            method: req.method,
            url: targetUrl,
            data: req.body,
            headers: {
                'Content-Type': req.headers['content-type'] || 'application/json',
                'Authorization': req.headers['authorization']
            },
            params: req.query,
            timeout: 10000
        });
        
        res.status(response.status).json(response.data);
        
    } catch (error) {
        if (error.response) {
            res.status(error.response.status).json(error.response.data);
        } else {
            res.status(500).json({ error: 'Gateway error', message: error.message });
        }
    }
});

app.listen(PORT, () => {
    console.log(`API Gateway listening on ${PORT}`);
});