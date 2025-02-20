import React, { useState, useEffect } from "react";
import NotificationItem from "./NotificationItem";
import { Bell, ArrowLeft } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "./toast";

const NotificationList = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const token = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
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
      const response = await fetch(`${API_BASE_URL}/notifications/${userId}`);
      const data = await response.json();
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
        `${API_BASE_URL}/notifications/${notificationId}/mark-as-read`,
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
        `${API_BASE_URL}/notifications/mark-all-as-read`,
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
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
      showErrorToast("Error while marking notification as read.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="md:bg-white rounded-lg md:shadow-md max-w-2xl mx-auto">
      <div className="flex items-center justify-between p-2 md:p-4 border-b border-gray-200">
        <div className="flex items-center md:gap-6">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-50 transition-colors duration-200"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 flex items-center">
            Notifications
          </h2>
        </div>
        <button
          className="text-xs sm:text-sm font-semibold text-gray-600 hover:text-gray-700"
          onClick={handleMarkAllAsRead}
        >
          Mark all as read
        </button>
      </div>
      {notifications && notifications.length === 0 ? (
        <div className="text-center py-12">
          <Bell className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 text-base sm:text-lg">
            No notifications to display
          </p>
        </div>
      ) : (
        <div className="max-h-screen md:max-h-[calc(100vh-200px)] overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <NotificationItem
                key={notification._id}
                notification={notification}
                onMarkAsRead={handleMarkAsRead}
                isRequest={notification.type === "request" ? true : false}
              />
            ))
          ) : (
            <p className="p-4 text-center text-gray-500">
              No notifications available
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationList;
