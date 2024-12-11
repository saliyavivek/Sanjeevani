import React from "react";
import {
  Calendar,
  Bell,
  CheckCircle,
  Briefcase,
  MessageSquare,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const NotificationItem = ({ notification, onMarkAsRead }) => {
  const { content, type, isRead, createdAt } = notification;

  const getIcon = () => {
    switch (type) {
      case "booking":
        return (
          <Calendar className="w-10 h-10 p-2 bg-emerald-100 text-emerald-600 rounded-full" />
        );
      case "general":
        return (
          <Bell className="w-10 h-10 p-2 bg-blue-100 text-blue-600 rounded-full" />
        );
      case "message":
        return (
          <MessageSquare className="w-10 h-10 p-2 bg-purple-100 text-purple-600 rounded-full" />
        );
      case "payment":
        return (
          <Briefcase className="w-10 h-10 p-2 bg-yellow-100 text-yellow-600 rounded-full" />
        );
      default:
        return (
          <Bell className="w-10 h-10 p-2 bg-gray-100 text-gray-600 rounded-full" />
        );
    }
  };

  return (
    <div
      className={`flex items-start p-4 ${
        isRead ? "bg-white" : "bg-blue-50"
      } border-b border-gray-200 transition-all duration-200 hover:bg-gray-50`}
    >
      <div className="flex-shrink-0 mr-4">{getIcon()}</div>
      <div className="flex-grow">
        <p className="text-sm text-gray-800 font-medium">{content}</p>
        <p className="text-xs text-gray-500 mt-1">
          {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
        </p>
      </div>
      {!isRead && (
        <button
          onClick={() => onMarkAsRead(notification._id)}
          className="flex-shrink-0 ml-4 text-blue-600 hover:text-blue-700 focus:outline-none transition-colors duration-200"
          aria-label="Mark as read"
        >
          <CheckCircle className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default NotificationItem;
