const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");

router.get('/forecast', weatherController.getWeatherData);
router.get("/health", weatherController.health);

module.exports = router;
