import React from "react";

const ReviewOptionsMenu = ({ onEdit, onDelete, onClose }) => {
  return (
    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
      <div className="py-1">
        <button
          onClick={() => {
            onEdit();
            onClose();
          }}
          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          Edit Review
        </button>
        <button
          onClick={() => {
            onDelete();
            onClose();
          }}
          className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
        >
          Delete Review
        </button>
      </div>
    </div>
  );
};

export default ReviewOptionsMenu;
