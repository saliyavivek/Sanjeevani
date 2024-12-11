import React from "react";
import NotificationList from "../components/NotificationList";

const NotificationsPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Your Notifications
        </h1>
        <NotificationList />
      </div>
    </div>
  );
};

export default NotificationsPage;
