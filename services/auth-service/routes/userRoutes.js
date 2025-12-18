const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateToken = require("../utils/authenticateToken")

router.get("/", userController.getAllUsers);
router.post("/", userController.createUser);
router.delete("/:id", userController.deleteUser);
router.post("/login", userController.loginUser);
router.get("/me", authenticateToken, userController.getUserData)

module.exports = router;