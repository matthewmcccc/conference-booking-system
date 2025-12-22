const Booking = require("../models/Booking");
const axios = require("axios");
const mongoose = require("mongoose");
const calcPrice = require("../utils/calculateBookingPrice");

exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find();
        if (!bookings) {
            return res.status(404).json("Couldn't get bookings");
        } 
        res.status(200).json(bookings);
    } catch (err) {
        console.error(`Couldn't get bookings: ${err}`);
        res.status(400).json({ message: err.message });
    }
}

exports.calculatePrice = async (req, res) => {
    try {
        const { roomId, date } = req.query;

        if (!date || !roomId) {
            return res.status(400).json({ message: "Date and roomID are required fields"})
        }

        const roomData = await axios.get(`${process.env.ROOM_SERVICE_URL}/${roomId}`);
        const room = roomData.data;

        const url = `${process.env.WEATHER_SERVICE_URL}/forecast?locationId=${room.location}&date=${date}`

        const weatherData = await axios.get(url);
        const weather = weatherData.data;

        const finalPrice = calcPrice(room.base_price, weather.temperature);

        if (finalPrice) {
            return res.status(200).json({
                final_price: finalPrice,
            })    
        }
    } catch (err) {
        console.error(`Couldn't calculate booking price: ${err}`);
        return res.status(400).json({ message: `Couldn't calculate booking price: ${err}`});
    }
}

exports.createBooking = async (req, res) => {
    try {
        const { room: roomId, date } = req.body;
        const { userId } = req.user;

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
        const { role } = req.user;
        
        if (role !== "admin") {
            return res.status(403).json({ message: "You don't have permissions to do this action"})
        };

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

exports.getBookingsForUser = async (req, res) => {
    try {
        const { role } = req.user;

        if (role !== "admin") {
            return res.status(403).json({ message: "You don't have permissions to perform this action"})
        }

        const userId = req.params.userid;
        const bookings = await Booking.find({ user: userId });
        if (bookings) {
            return res.status(200).json({ message: "Retrieved bookings for user", bookings: bookings })
        };
        return res.status(404).json({ message: "Couldn't retrieve bookings for user "})
    } catch (error) {
        console.error(`Couldn't fetch bookings for user: ${error}`);
        return res.status(400).json({ message: error.message });
    }
}

exports.health = async (req, res) => {
    try {
        return res.status(200).json({ message: "Booking service is healthy"})
    } catch (error) {
        return res.status(404).json({ message: ` Booking service isn't healthy: ${error}` })
    }
}