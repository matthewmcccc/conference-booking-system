const express = require("express");
const bookingController = require("../controllers/bookingController");
const router = express.router();

router.get("/", bookingController.getAllBookings);

module.exports = router;