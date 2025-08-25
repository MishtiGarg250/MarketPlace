const express = require("express");
const router = express.Router();
const {protect, authorize} = equire("../middleware/auth");
const multer = require("multer");

const{
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
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
router.post("/", protect, authorize("seller"), upload.array("images", 5), createProduct); 
router.put("/:id", protect, authorize("seller"), updateProduct);
router.delete("/:id", protect, authorize("seller"), deleteProduct);