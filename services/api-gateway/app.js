const express = require("express");
const axios = require("axios");
const app = express();
const { createProxyMiddleware } = require("http-proxy-middleware");
const PORT = 8082;

const cors = require('cors');
app.use(cors());
app.use(express.json());

const WEATHER_SERVICE_URL = process.env.WEATHER_SERVICE_URL || 'http://weather-service:8080'
const LOCATION_SERVICE_URL = process.env.LOCATION_SERVICE_URL ||  'http://location-service:8081'


app.use('/api/locations', createProxyMiddleware({
    target: LOCATION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {'^/api/locations': ''}
}))

app.use('/api/weather', createProxyMiddleware({
    target: WEATHER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {'^/api/weather': ''}
}))

app.listen(PORT, () => {
    console.log(`API Gateway listening on ${PORT}`);
})
