const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");

router.get('/forecast/:month', weatherController.getWeatherData);

module.exports = router;


