require("./config/db");
const express = require("express");
const app = express();
const bookingRoutes = require("./routes/bookingRoutes");
const PORT = 8085 || process.env.PORT;

app.use(express.json());

app.use("/api/bookings", bookingRoutes);

app.listen(PORT, () => {
    console.log(`Booking service listening on port: ${PORT}`);
})