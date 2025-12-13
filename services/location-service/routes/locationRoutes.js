const express = require("express");
const router = express.Router();
const locationController = require('../controllers/locationController');

router.get('/', locationController.getAllLocations);
router.post('/', locationController.createNewLocation);
router.get('/:id', locationController.getLocationById);
router.put('/:id', locationController.editLocationById)

module.exports = router;