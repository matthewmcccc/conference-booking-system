const { getWeatherData } = require("../utils/getWeatherData");
require("dotenv").config()
const axios = require("axios");

exports.getWeatherData = async (req, res) => {
    try {
        console.log('FORECAST_API:', process.env.FORECAST_API); // ADD THIS
        console.log('LOCATION_SERVICE_URL:', process.env.LOCATION_SERVICE_URL); // ADD THIS

        const { locationId, date } = req.query;
        console.log("Request received at weather API");
        console.log(req.query);
        
        const locationData = await axios.get(`${process.env.LOCATION_SERVICE_URL}/${locationId}`);
        let lat, lng;
        if (locationData.data.lat) lat = locationData.data.lat;
        if (locationData.data.lng) lng = locationData.data.lng;

        const bookingDate = new Date(date);
        const dateNowUnix = Math.floor(new Date().getTime() / 1000);
        const dateUnix = Math.floor(bookingDate.getTime() / 1000);
        const timeDiff = dateUnix - dateNowUnix;

        // check if the booking is made too far in advance (more than a week from now).
        // we need to mock weather data if so. else, call weather API
        // also, if we dont have complete coordinates we can't call the weather API
        // so we use mock data.
        if (Math.floor(timeDiff / 86400) > 7 || (!lat || !lng)) {
            const month = bookingDate.getMonth();
            if (month < 0 || month > 11) { return res.status(400).json({ error: 'Invalid month' })};
            const monthNum = parseInt(month);
            const temp = getWeatherData(monthNum);
            res.json({
                month: monthNum,
                temperature: temp
            });
        } else {
            const url = `${process.env.FORECAST_API}?latitude=${lat}&longitude=${lng}&hourly=temperature_2m`;
            const forecastData = await axios.get(url);
            const hourlyData = forecastData.data.hourly;

            const temperatures = hourlyData.time
                .map((time, index) => ({
                    time,
                    temp: hourlyData.temperature_2m[index]
                }))
                .filter(entry => entry.time.startsWith(date))
                .map(entry => entry.temp);

            const avgTemp = temperatures.length > 0
                ? temperatures.reduce((sum, temp) => sum + temp, 0) / temperatures.length
                : null;
            
            res.json({
                date: date,
                temperature: avgTemp ? Math.round(avgTemp * 10) / 10 : null,
                hourlyCount: temperatures.length
            });
        }
    } catch (err) {
        console.error(`Couldn't get weather data: ${err}`);
        res.status(400).json({ error: err.message });
    }
}

exports.health = async (req, res) => {
    try {
        return res.status(200).json({ message: "Weather service is healthy"})
    } catch (error) {
        return res.status(404).json({ message: "Weather service is down"})
    };
}