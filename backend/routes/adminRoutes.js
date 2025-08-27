const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const adminController = require("../controllers/adminController");

// Only admin can access these routes
router.get("/stats", protect, authorize("admin"), adminController.getStats);
router.get("/users", protect, authorize("admin"), adminController.getUsers);
router.get("/products", protect, authorize("admin"), adminController.getProducts);

module.exports = router;
