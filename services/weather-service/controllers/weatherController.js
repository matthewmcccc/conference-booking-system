const { getWeatherData } = require("../utils/getWeatherData");
require("dotenv").config()
const axios = require("axios");

exports.getWeatherData = async (req, res) => {
    try {
        const { locationId, date } = req.query;
        
        const locationData = await axios.get(`${process.env.LOCATION_SERVICE_URL}/${locationId}`);
        console.log(locationData);

        const bookingDate = new Date(date);
        const dateNowUnix = Math.floor(new Date().getTime() / 1000);
        const dateUnix = Math.floor(bookingDate.getTime() / 1000);
        const timeDiff = dateUnix - dateNowUnix;

        // check if the booking is made too far in advance (more than a week from now).
        // we need to mock weather data if so. else, call weather API
        if (Math.floor(timeDiff / 86400) > 7) {
            const month = bookingDate.getMonth();
            if (month < 0 || month > 11) { return res.status(400).json({ error: 'Invalid month' })};
            const monthNum = parseInt(month);
            const temp = getWeatherData(monthNum);
            res.json({
                month: monthNum,
                temperature: temp
            });
        }
        
    } catch (err) {
        console.error(`Couldn't get weather data: ${err}`);
        res.status(400).json({ error: err.message });
    }
}