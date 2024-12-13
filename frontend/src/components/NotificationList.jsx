import React, { useState, useEffect } from "react";
import NotificationItem from "./NotificationItem";
import { Bell, Filter, CheckSquare } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";

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
      fetchNotifications(userId);
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await fetch("http://localhost:8080/api/notifications/mark-all-as-read", {
        method: "POST",
      });
      // setNotifications(
      //   notifications.map((notif) => ({ ...notif, isRead: true }))
      // );
    } catch (error) {
      console.error("Error marking all notifications as read:", error);
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
    <div className="bg-white rounded-lg shadow-lg max-w-2xl mx-auto">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <Bell className="w-6 h-6 mr-2 text-blue-500" />
          Notifications
        </h2>
        {/* <div className="flex items-center space-x-2">
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All</option>
            <option value="unread">Unread</option>
            <option value="booking">Bookings</option>
            <option value="general">General</option>
          </select>
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm text-blue-600 hover:text-blue-700 focus:outline-none transition-colors duration-200"
          >
            Mark all as read
          </button>
        </div> */}
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
