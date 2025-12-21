const express = require("express");
const router = express.Router();
const weatherController = require("../controllers/weatherController");

router.get('/forecast', weatherController.getWeatherData);
router.get("/heath", weatherController.health);

module.exports = router;
