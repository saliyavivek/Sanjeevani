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

const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ message: "User id is required" });
    }
    const updatedNotifications = await Notification.updateMany(
      { userId, isRead: false },
      { isRead: true },
      { new: true }
    );

    res.status(200).json(updatedNotifications);
  } catch (error) {
    res.status(500).json({ message: "Error updating notification", error });
  }
};

const getUnreadNotifications = async (req, res) => {
  const { userId } = req.params;

  // Set SSE headers
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  try {
    // Send any unread notifications immediately when the client connects
    const unreadNotifications = await Notification.find({
      userId,
      isRead: false,
    });

    if (unreadNotifications.length > 0) {
      res.write(`data: ${JSON.stringify(unreadNotifications)}\n\n`);
    }

    // Simulate real-time notifications for the demo (replace with your real logic)
    const interval = setInterval(async () => {
      // Check for new unread notifications
      const newNotifications = await Notification.find({
        userId,
        isRead: false,
      });

      if (newNotifications.length > 0) {
        res.write(`data: ${JSON.stringify(newNotifications)}\n\n`);
      }
    }, 10000); // Check every 10 seconds

    // Close the connection when the client disconnects
    req.on("close", () => {
      clearInterval(interval);
      res.end();
    });
  } catch (error) {
    console.error("Error in SSE notifications:", error);
    res.status(500).end();
  }
};

module.exports = {
  fetchNotification,
  markAsRead,
  markAllAsRead,
  getUnreadNotifications,
};
