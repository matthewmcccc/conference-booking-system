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