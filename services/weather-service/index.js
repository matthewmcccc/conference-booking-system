const express = require("express");
const app = express();
const port = 3000;
const weatherRoutes = require("./routes/weatherRoutes")

app.use(express.json())
app.use('/api/weather', weatherRoutes);

app.listen(port, () => {
    console.log(`Weather service running on port ${port}`);
})