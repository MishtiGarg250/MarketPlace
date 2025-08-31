const express = require("express");
const router = express.Router();
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController");

const { protect } = require("../middleware/auth");

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/:id", protect, updateCartItem);
router.delete("/:id", protect, removeCartItem);

module.exports = router;
