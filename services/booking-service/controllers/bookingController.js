const Booking = require("../models/Booking");
const Location = require("../../location-service/models/Location");
const axios = require("axios");
const mongoose = require("mongoose");
const calcPrice = require("../utils/calculateBookingPrice");

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        if (bookings.length == 0) {
            return res.status(404).json("Couldn't find any bookings");
        } 
        res.status(200).json(bookings);
    } catch (err) {
        console.error(`Couldn't get bookings: ${err}`);
        res.status(400).json({ message: err.message });
    }
}

exports.createBooking = async (req, res) => {
    try {
        const { room: roomId, date } = req.body;
        const { userId, role } = req.user;

        const existingBooking = await Booking.findOne({ date: date, room: roomId });

        if (existingBooking) {
            return res.status(400).json({ error: "Booking already exists on this day for this room"});
        }

        if (!roomId || !date) {
            return res.status(400).json({ error: "Room ID and booking Date are required"});
        }

        const roomData = await axios.get(`${process.env.ROOM_SERVICE_URL}/${roomId}`);
        const locationId = roomData.data.location;
        const weatherData = await axios.get(`${process.env.WEATHER_SERVICE_URL}/forecast`, {
            params: {
                locationId: locationId,
                date: date
            }
        })

        const basePrice = roomData.data.base_price;
        const temperature = weatherData.data.temperature
        const finalPrice = calcPrice(basePrice, temperature);
        const weatherAdjustment = finalPrice - basePrice;

        const booking = await Booking.create(
            {
                user: userId,
                room: roomId,
                date: new Date(date),
                base_price: basePrice,
                weather_adjustment: Math.round(weatherAdjustment * 100) / 100 ,
                total_price: finalPrice
            }
        );
        if (!booking) {
            return res.status(404).json("Couldn't create booking")
        }
        res.status(200).json({ message: "Created booking successfully", booking: booking });
    } catch (err) {
        console.error(`Couldn't create booking: ${err}`);
        res.status(400).json({ message: err.message });
    }
}

exports.deleteBooking = async (req, res) => {
    try {
        const id = new mongoose.Types.ObjectId(req.params.id);
        const booking = await Booking.findByIdAndDelete(id);
        if (!booking) {
            return res.status(404).json({ message: "Couldn't find booking to delete "});
        }
        res.status(200).json({message: "Booking successfully deleted", booking: booking});
    } catch (err) {
        console.error(`Couldn't delete booking: ${err}`);
        res.status(400).json({ error: err.message });
    }
}