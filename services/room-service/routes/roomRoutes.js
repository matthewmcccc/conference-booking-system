const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");

router.get("/health", roomController.health);
router.get("/", roomController.getAllRooms);
router.get("/:id", roomController.getRoomById);
router.put("/:id", roomController.editRoomById);
router.post("/", roomController.createRoom);
router.delete("/:id", roomController.deleteRoom)
router.delete("/location/:locationId", roomController.deleteRoomByLocationId);

module.exports = router;