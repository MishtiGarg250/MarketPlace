const express = require("express");
const router = express.Router();
const { createStripeSession, mockComplete } = require("../controllers/StripeController");

const { protect, authorize } = require("../middleware/auth");

router.post("/stripe-session", protect, authorize("buyer"), createStripeSession);
router.post("/mock-complete", protect, mockComplete);


module.exports = router;
