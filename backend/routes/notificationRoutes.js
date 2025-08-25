const express = require("express");
const router = express.Router();
const {}=require("../controllers/notificationController");

router.post("/",createNotification);
router.get(":/userId",getUserNotifications);
router.patch("/:id/read",markAsRead);
router.delete("/:id",deleteNotification);