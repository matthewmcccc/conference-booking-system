const express = require("express");
const bookingController = require("../controllers/bookingController");
const router = express.Router();
const authenticateToken = require("../middleware/auth");

router.get("/health", bookingController.health);
router.get("/", authenticateToken, bookingController.getAllBookings);
router.get("/calculate-price", authenticateToken, bookingController.calculatePrice);
router.post("/", authenticateToken, bookingController.createBooking);
router.delete("/:id", authenticateToken, bookingController.deleteBooking);
router.get("/:userid", authenticateToken, bookingController.getBookingsForUser);

module.exports = router;