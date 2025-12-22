const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const authenticateToken= require("../middleware/auth");

router.get("/health", roomController.health);
router.get("/", roomController.getAllRooms);
router.get("/:id", roomController.getRoomById);
router.put("/:id", authenticateToken, roomController.editRoomById);
router.post("/", authenticateToken, roomController.createRoom);
router.delete("/:id", authenticateToken, roomController.deleteRoom)
router.delete("/location/:locationId", authenticateToken, roomController.deleteRoomByLocationId);

module.exports = router;