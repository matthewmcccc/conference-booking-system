const { getWeatherData } = require("../utils/getWeatherData");

exports.getWeatherData = async (req, res) => {
    try {
        const { month } = req.params;
        if (month < 0 || month > 11) { return res.status(400).json({ error: 'Invalid month' })};
        const monthNum = parseInt(month);
        const temp = getWeatherData(monthNum);
        res.json({
            month: monthNum,
            temperature: temp
        });
    } catch (err) {
        console.err(`Couldn't get weather data: ${err}`);
        res.status(400).json({ error: err.message });
    }
}