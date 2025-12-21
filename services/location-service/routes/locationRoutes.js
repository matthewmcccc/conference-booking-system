const express = require("express");
const router = express.Router();
const locationController = require('../controllers/locationController');

router.get('/', locationController.getAllLocations);
router.post('/', locationController.createNewLocation);
router.get('/:id', locationController.getLocationById);
router.get('/:id/rooms', locationController.getAllRoomsForLocation);
router.put('/:id', locationController.editLocationById)
router.delete('/:id', locationController.deleteLocation);
router.get("/health", locationController.health);

module.exports = router;