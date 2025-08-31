const express = require("express");
const router = express.Router();

const { checkout } = require("../controllers/CheckoutController");
const { protect, authorize } = require("../middleware/auth");
const checkoutLimiter = require("../middleware/checkoutLimiter");
const idempotency = require("../middleware/idempotency");

router.post(
	"/",
	checkoutLimiter,
	idempotency,
	protect,
	authorize("buyer"),
	checkout
);

module.exports = router;
