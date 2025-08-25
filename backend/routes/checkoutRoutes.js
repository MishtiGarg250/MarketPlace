const express = require("express");
const router = express.Router();
const { checkout } = require("../controllers/CheckoutController")
const { protect, authorize } = require("../middleware/authMiddleware");


router.post("/", protect, authorize("buyer"), checkout);

module.exports = router;
