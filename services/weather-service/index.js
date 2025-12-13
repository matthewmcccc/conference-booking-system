const express = require("express");
const app = express();
const PORT = process.env.PORT || 8080;
const weatherRoutes = require("./routes/weatherRoutes")

app.use(express.json())
app.use('/api/weather', weatherRoutes);

app.listen(PORT, () => {
    console.log(`Weather service running on port ${PORT}`);
})