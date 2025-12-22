const jwt = require("jsonwebtoken");
const request = require("supertest")
const app = require("../app")
const axios = require("axios");
require("dotenv").config();

const generateToken = (userData) => {
    return jwt.sign(
        {
            userId: userData.userId || "507f1f77bcf86cd799439011",
            email: userData.email || "test@example.com",
            role: userData.role || "user"
        },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
    )
} 

const setupBookingMocks = () => {
    axios.get.mockImplementation((url) => {
        if (url.includes('/api/rooms/')) {
            return Promise.resolve({
                data: {
                    id: "693ebb3b894bc4f1c01d48fd",
                    name: "Conference Room A",
                    capacity: 20,
                    base_price: 100,
                    location: "673ebb3b894bc4f1c01d48fd"
                }
            });
        }
        
        if (url.includes('/api/weather')) {
            return Promise.resolve({
                data: { temperature: 15 }
            });
        }
        
        if (url.includes('/api/locations/')) {
            return Promise.resolve({
                data: {
                    latitude: 56.462,
                    longitude: -2.970
                }
            });
        }
        
        return Promise.reject(new Error(`Unmocked URL: ${url}`));
    });
}

const createMockBooking = async (token) => {
    setupBookingMocks();
    const bookingData = {
        room: "693ebb3b894bc4f1c01d48fd",
        date: new Date("2025-12-20")
    };
    return await request(app)
        .post("/api/bookings")
        .set("Authorization", `Bearer ${token}`)
        .send(bookingData);
}

module.exports = {generateToken, setupBookingMocks, createMockBooking};