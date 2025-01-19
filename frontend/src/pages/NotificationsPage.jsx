import React from "react";
import NotificationList from "../components/NotificationList";

const NotificationsPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <NotificationList />
      </div>
    </div>
  );
};

export default NotificationsPage;
