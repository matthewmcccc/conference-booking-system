const express = require("express");
const router = express.Router();
const locationController = require('../controllers/locationController');
const authenticateToken = require("../middleware/auth");

router.get("/health", locationController.health);
router.get('/', locationController.getAllLocations);
router.post('/', authenticateToken, locationController.createNewLocation);
router.get('/:id', locationController.getLocationById);
router.get('/:id/rooms', locationController.getAllRoomsForLocation);
router.put('/:id', authenticateToken, locationController.editLocationById)
router.delete('/:id', authenticateToken, locationController.deleteLocation);

module.exports = router;