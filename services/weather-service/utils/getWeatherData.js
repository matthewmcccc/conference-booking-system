// @param month: integer
// @param day: integer
// returns temp: float

const getWeatherData = (month) => {
    // base temperatures for months jan - dec
    let baseTemps = [5, 7, 9, 10, 13, 15, 18, 20, 19, 17, 14, 10]
    let baseTemp = baseTemps[month];
    let finalTemp = Math.round(baseTemp * (Math.random() * (1.2 - 0.8) + 0.8) * 10) / 10;
    return finalTemp;
}

module.exports = { getWeatherData };