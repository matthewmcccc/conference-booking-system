const Booking = require("../models/Booking");

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        if (bookings.length() == 0) {
            res.status(404).json("Couldn't find any bookings");
        } else {
            res.status(200).json(bookings);
        }
    } catch (err) {
        console.error(`Couldn't get bookings: ${err}`);
        res.status(400).json({ message: err.message });
    }
}