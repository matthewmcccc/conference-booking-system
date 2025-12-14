require('dotenv').config();
require("./config/db")
const express = require("express");
const app = express();
const PORT = process.env.port || 8083;
const roomRoutes = require("./routes/roomRoutes");

app.use(express.json());
app.use('/api/rooms', roomRoutes);

app.listen(PORT, () => {
    console.log(`Room service running on port: ${PORT}`);
})