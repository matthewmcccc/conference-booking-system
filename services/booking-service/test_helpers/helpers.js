const jwt = require("jsonwebtoken");
const axios = require("axios");

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
    axios.get.mockResolvedValueOnce({
        data: {
            id: "693ebb3b894bc4f1c01d48fd",
            name: "Conference Room A",
            capacity: 20,
            base_price: 100
        }
    });

    axios.get.mockResolvedValueOnce({
        data: { temperature: 15 }
    });

    axios.get.mockResolvedValueOnce({
        data: {
            latitude: 56.462,
            longitude: -2.970
        }
    });
}

module.exports = {generateToken, setupBookingMocks};