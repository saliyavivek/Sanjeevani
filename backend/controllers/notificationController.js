const Notification = require("../models/Notification");

const fetchNotification = async (req, res) => {
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const notifications = await Notification.find({ userId }).sort({
      createdAt: -1,
    });

    if (!notifications || notifications.length === 0) {
      return res
        .status(404)
        .json({ message: "No notifications found for this user" });
    }

    res.status(200).json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};

const markAsRead = async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    if (!notificationId) {
      return res.status(400).json({ message: "Notification ID is required" });
    }
    const updatedNotification = await Notification.findByIdAndUpdate(
      notificationId,
      {
        isRead: true,
      },
      { new: true }
    );

    res.status(200).json(updatedNotification);
  } catch (error) {
    res.status(500).json({ message: "Error updating notification", error });
  }
};

module.exports = {
  fetchNotification,
  markAsRead,
};
