
const express = require("express");
const router = express.Router();
const {protect, authorize} = require("../middleware/auth");
const multer = require("multer");
const path = require("path");

const{
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct,
    markFeatured
} = require("../controllers/productController");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // folder must exist
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });


router.get("/", getProducts);
router.post("/", protect, authorize("seller"), createProduct); 
router.put("/:id", protect, authorize("seller"), updateProduct);
router.delete("/:id", protect, authorize("seller"), deleteProduct);
router.put("/:id/feature", protect, authorize("seller"), markFeatured);

// Seller analytics and orders endpoints
const { getSellerAnalytics, getSellerOrders } = require("../controllers/sellerController");
router.get("/seller/:sellerId/analytics", getSellerAnalytics);
router.get("/seller/:sellerId/orders", getSellerOrders);

module.exports = router;