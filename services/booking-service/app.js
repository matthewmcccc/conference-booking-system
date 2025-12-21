const bookingRoutes = require("./routes/bookingRoutes");
const express = require("express");
const app = express();
const cors = require("cors");

app.use(cors({
  origin: [
    '*'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
});
app.use("/api/bookings", bookingRoutes);

module.exports = app;