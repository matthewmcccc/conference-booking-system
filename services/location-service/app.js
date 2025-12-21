
require('dotenv').config();
const express = require("express");
const locationRoutes = require("./routes/locationRoutes");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: [
    '*'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use('/api/locations', locationRoutes);

module.exports = app