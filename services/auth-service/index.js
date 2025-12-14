const express = require("express");
const userRoutes = require("./routes/userRoutes");
const app = express();
const PORT = process.env.PORT || 8084;
require("dotenv").config();
require("./config/db");

app.use(express.json());
app.use('/api/auth', userRoutes);

app.listen(PORT, () => {
    console.log(`User auth listening on port: ${PORT}`);
})
