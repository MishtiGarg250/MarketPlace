const express = require("express");
const router = express.Router();
const { checkout } = require("../controllers/CheckoutController")
const { protect, authorize } = require("../middleware/auth");


router.post("/", protect, authorize("buyer"), checkout);

module.exports = router;
