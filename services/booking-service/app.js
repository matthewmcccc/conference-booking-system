const bookingRoutes = require("./routes/bookingRoutes");
const express = require("express");
const app = express();

app.use(express.json());
app.use("/api/bookings", bookingRoutes);

module.exports = app;