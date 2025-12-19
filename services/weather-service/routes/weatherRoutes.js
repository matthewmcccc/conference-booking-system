const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");

router.get('/forecast', weatherController.getWeatherData);

module.exports = router;
