const jwt = require("jsonwebtoken");
require ("dotenv").config();

const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access token required' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            userId: decoded.userId,
            email: decoded.email,
            role: decoded.role
        };
        next();
    } catch (err) {
        console.error(`Error: ${err}`);
        return res.status(403).json({ error: "Invalid or expired token" })
    }
}

module.exports = authenticateToken;