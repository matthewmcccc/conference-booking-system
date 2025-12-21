const bookingRoutes = require("./routes/bookingRoutes");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors({
  origin: [
    'http://localhost',
    'http://localhost:80', 
    'http://localhost:8080',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use("/api/bookings", bookingRoutes);

module.exports = app;