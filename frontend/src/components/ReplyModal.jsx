"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

const ReplyModal = ({ isOpen, onClose, onSubmit, initialReply = "" }) => {
  const [reply, setReply] = useState(initialReply);

  useEffect(() => {
    setReply(initialReply);
  }, [initialReply]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(reply);
    setReply("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 p-2 hover:bg-gray-100 rounded-full"
        >
          <X className="w-6 h-6" />
        </button>
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {initialReply ? "Edit Reply" : "Reply"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="review"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Your Reply
            </label>
            <textarea
              id="review"
              rows="4"
              className="appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Write your reply here..."
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
            >
              {initialReply ? "Update Reply" : "Submit Reply"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReplyModal;
