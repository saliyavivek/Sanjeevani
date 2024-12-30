import React, { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

const DeleteAccountModal = ({ isOpen, onClose, onConfirmDelete }) => {
  const [confirmText, setConfirmText] = useState("");

  if (!isOpen) return null;

  const handleConfirmDelete = () => {
    if (confirmText.toLowerCase() === "delete") {
      onConfirmDelete();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">Delete account</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close modal"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-red-50 rounded-lg text-red-700">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">This action is irreversible</p>
            </div>

            <p className="text-gray-600">
              Deleting your account will remove all of your information from our
              database. This cannot be undone.
            </p>

            <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
              <li>
                Your profile and personal data will be permanently deleted
              </li>
              <li>
                You will lose access to all your bookings and saved listings
              </li>
              <li>Your reviews and ratings will be removed</li>
              <li>You won't be able to reactivate your account</li>
            </ul>

            <div className="pt-2">
              <label
                htmlFor="confirm-delete"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                To confirm, type "delete" below:
              </label>
              <input
                type="text"
                id="confirm-delete"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-red-500 focus:border-red-500"
                placeholder="Type 'delete'"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row-reverse gap-3">
            <button
              onClick={handleConfirmDelete}
              disabled={confirmText.toLowerCase() !== "delete"}
              className="w-full sm:w-auto px-6 py-3 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Delete account
            </button>
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
