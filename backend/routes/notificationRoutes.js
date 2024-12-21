const express = require("express");
const {
  fetchNotification,
  markAsRead,
  markAllAsRead,
} = require("../controllers/notificationController");
const router = express.Router();

router.get("/:userId", fetchNotification);
router.put("/:notificationId/mark-as-read", markAsRead);
router.put("/mark-all-as-read", markAllAsRead);

module.exports = router;
