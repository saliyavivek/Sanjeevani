const express = require("express");
const {
  fetchNotification,
  markAsRead,
} = require("../controllers/notificationController");
const router = express.Router();

router.get("/:userId", fetchNotification);
router.put("/:notificationId/mark-as-read", markAsRead);

module.exports = router;
