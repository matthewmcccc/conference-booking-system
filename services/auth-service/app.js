const express = require("express");
const userRoutes = require("./routes/userRoutes");
const app = express();

app.use((req, res, next) => {
    console.log('====================================');
    console.log(`[AUTH] Received: ${req.method} ${req.url}`);
    console.log('Headers:', JSON.stringify(req.headers, null, 2));
    console.log('Body (raw):', req.body);
    console.log('====================================');
    next();
});

app.use(express.json());

app.use((req, res, next) => {
    console.log('Body (after JSON parse):', req.body);
    next();
});

app.use('/api/auth', userRoutes);

module.exports = app;