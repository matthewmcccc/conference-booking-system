const express = require("express");
const axios = require("axios");
const app = express();
const { createProxyMiddleware } = require("http-proxy-middleware");
const PORT = process.env.PORT || 8086;

const cors = require('cors');
app.use(cors());
app.use(express.json());

const WEATHER_SERVICE_URL = process.env.WEATHER_SERVICE_URL || 'http://weather-service:8080'
const LOCATION_SERVICE_URL = process.env.LOCATION_SERVICE_URL ||  'http://location-service:8081'
const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || "http://auth-service:8084"
const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || "http://booking-service:8085"
const ROOM_SERVICE_URL = process.env.ROOM_SERVICE_URL || "http://room-service:8083"

app.use('/api', createProxyMiddleware({
    router: (req) => {
        if (req.path.startsWith('/locations')) return LOCATION_SERVICE_URL;
        if (req.path.startsWith('/weather')) return WEATHER_SERVICE_URL;
        if (req.path.startsWith('/auth')) return AUTH_SERVICE_URL;
        if (req.path.startsWith('/bookings')) return BOOKING_SERVICE_URL;
        if (req.path.startsWith('/rooms')) return ROOM_SERVICE_URL;
    },
    changeOrigin: true,
    pathRewrite: (path) => '/api' + path
}))

app.listen(PORT, () => {
    console.log(`API Gateway listening on ${PORT}`);
})