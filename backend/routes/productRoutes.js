const express = require("express");
const router = express.Router();
const {protect, authorize} = equire("../middleware/auth");

const{
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
} = require("../controllers/productController");
router.get("/", getProducts);
router.post("/", protect, authorize("seller"), createProduct);
router.put("/:id", protect, authorize("seller"), updateProduct);
router.delete("/:id", protect, authorize("seller"), deleteProduct);