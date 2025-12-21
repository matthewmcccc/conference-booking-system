const express = require("express");
const app = express();
const weatherRoutes = require("./routes/weatherRoutes")
const cors = require("cors")

app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json())
app.use('/api/weather', weatherRoutes);

module.exports = app;
