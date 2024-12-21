import React, { useState, useEffect } from "react";
import NotificationItem from "./NotificationItem";
import { Bell, Filter, CheckSquare, ArrowLeft } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "./toast";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([
    {
      content:
        "Your booking for warehouse Grand Axis Depot has been confirmed.",
      createdAt: "2024-12-11T15:53:27.807Z",
      isRead: false,
      type: "booking",
      userId: "674b4373a3eb39ec05f508fd",
      _id: "6759b577688aabf90553e665",
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [userId, setUserId] = useState(null);
  const token = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserIdAndNotifications = async () => {
      if (token) {
        const { userId } = await jwtDecode(token);
        setUserId(userId);
        fetchNotifications(userId);
      }
    };
    fetchUserIdAndNotifications();
  }, [token]);

  const fetchNotifications = async (userId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/notifications/${userId}`
      );
      const data = await response.json();
      // console.log(data);

      setNotifications(data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/notifications/${notificationId}/mark-as-read`,
        {
          method: "PUT",
        }
      );

      if (!response.ok) {
        console.log("Error while marking notification as read.");
        return;
      }
      showSuccessToast("Notification marked as read.");
      fetchNotifications(userId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      showErrorToast("Error while marking notification as read.");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/notifications/mark-all-as-read",
        {
          method: "PUT",
          body: JSON.stringify({
            userId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        console.log("Error while marking all notifications as read.");
        return;
      }
      showSuccessToast("All notifications marked as read.");
      fetchNotifications(userId);
      // setNotifications(
      //   notifications.map((notif) => ({ ...notif, isRead: true }))
      // );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      showErrorToast("Error while marking notification as read.");
    }
  };

  // const filteredNotifications = notifications?.filter((notif) => {
  //   if (filter === "all") return true;
  //   if (filter === "unread") return !notif.isRead;
  //   return notif.type === filter;
  // });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg max-w-2xl mx-auto">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-50 transition-colors duration-200"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-2xl ml-4 font-semibold text-gray-800 flex items-center">
          Notifications
        </h2>
        <button
          className="text-sm font-semibold text-gray-600 hover:text-gray-700 justify-self-end"
          onClick={handleMarkAllAsRead}
        >
          Mark all as read
        </button>
      </div>
      {notifications && notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No notifications to display</p>
        </div>
      ) : (
        <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))
          ) : (
            <p>No notifications available</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationList;
