const express = require("express");
const app = express();
const port = 3000;

// param: month - integer
// param: day - integer
// returns: temp - float
const getWeatherData = (month) => {
    // base temperatures for months jan - dec
    let baseTemps = [5, 7, 9, 10, 13, 15, 18, 20, 19, 17, 14, 10]
    let baseTemp = baseTemps[month];
    let finalTemp = Math.round(baseTemp * (Math.random() * (1.2 - 0.8) + 0.8) * 10) / 10;
    return finalTemp;
}

app.get('/forecast/:month', (req, res) => {
    const { month } = req.params;
    if (month < 0 || month > 11) { return res.status(400).json({ error: 'Invalid month' })};
    const monthNum = parseInt(month);
    const temp = getWeatherData(monthNum);
    res.json({
        month: monthNum,
        temperature: temp
    })
})

app.listen(port, () => {
    console.log(`Weather service running on port ${port}`);
})