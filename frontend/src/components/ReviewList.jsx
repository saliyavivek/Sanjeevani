"use client";

import { useState, useEffect } from "react";
import { Star, MoreVertical } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import ReviewOptionsMenu from "./ReviewOptionsMenu";
import { formatDistanceToNow } from "date-fns";
import useAuth from "../hooks/useAuth";
import ReplyModal from "./ReplyModal";
import { showErrorToast, showSuccessToast } from "./toast";
import ReviewReply from "./ReviewReply";

const ReviewCard = ({
  review,
  onEdit,
  onDelete,
  warehouse,
  onReply,
  onEditReply,
  onDeleteReply,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const shouldShowMore = review.review.length > 150;
  const storedToken = useAuth();

  useEffect(() => {
    fetchCurrentUser();
  }, [storedToken]);

  const fetchCurrentUser = async () => {
    if (storedToken) {
      try {
        const decodedToken = await jwtDecode(storedToken);
        setCurrentUser(decodedToken);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
  };

  const isCurrentUserReview =
    currentUser && currentUser.userId === review.userId._id;

  const calculateDuration = (dateString) => {
    const currentDate = new Date();
    const targetDate = new Date(dateString);
    const difference = currentDate - targetDate;

    const totalDays = difference / (1000 * 60 * 60 * 24);
    const totalMonths = difference / (1000 * 60 * 60 * 24 * 30);
    const totalYears = difference / (1000 * 60 * 60 * 24 * 365);

    if (currentDate.getMonth() === targetDate.getMonth()) {
      return `${Math.round(totalDays)} day(s)`;
    } else if (totalMonths < 12) {
      return `${Math.round(totalMonths)} month(s)`;
    } else {
      return `${Math.round(totalYears)} year(s)`;
    }
  };

  return (
    <div className="mb-4 relative md:border-b-0 md:pb-0 border-b pb-4">
      <div className="flex items-center mb-4">
        <div className="relative">
          <a href={`/users/f/show/${review.userId._id}`}>
            {review.userId.avatar ? (
              <img
                src={review.userId.avatar || "/placeholder.svg"}
                alt={`${review.userId.name}'s profile`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white text-lg font-semibold">
                {review.userId.name.charAt(0)}
              </div>
            )}
          </a>
        </div>
        <div className="ml-4 flex-grow">
          <h3 className="font-semibold text-gray-900">{review.userId.name}</h3>
          <div className="flex items-center text-sm text-black-500">
            <span>
              {calculateDuration(review.userId.createdAt)} on Sanjeevani
            </span>
          </div>
        </div>
        {isCurrentUserReview && (
          <div className="relative">
            <button
              onClick={() => setShowOptions(!showOptions)}
              className="p-1 rounded-full hover:bg-gray-100"
            >
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
            {showOptions && (
              <ReviewOptionsMenu
                onEdit={() => onEdit(review)}
                onDelete={() => onDelete(review._id)}
                onClose={() => setShowOptions(false)}
              />
            )}
          </div>
        )}
      </div>

      <div className="mb-2 flex items-center">
        <div className="flex">
          {[...Array(5)].map((_, index) => (
            <Star
              key={index}
              className={`w-3 h-3 ${
                index < review.ratings
                  ? "text-black-400 fill-current"
                  : "text-gray-300"
              }`}
            />
          ))}
        </div>
        <div className="ml-1 h-[2px] w-[2px] rounded bg-[#6A6A6A]"></div>
        <span className="ml-1 text-sm text-gray-800 font-semibold">
          {formatDistanceToNow(new Date(review.createdAt), { addSuffix: true })}
        </span>
      </div>

      <div className="text-base text-gray-900">
        {shouldShowMore && !isExpanded ? (
          <>
            <p>{review.review.slice(0, 150)}...</p>
            <button
              onClick={() => setIsExpanded(true)}
              className="mt-1 text-gray-900 font-semibold hover:underline"
            >
              Show more
            </button>
          </>
        ) : (
          <p>{review.review}</p>
        )}
      </div>

      <div>
        {review.reply &&
          typeof review.reply.text === "string" &&
          review.reply.text.trim() !== "" && (
            <ReviewReply
              reply={review.reply}
              onEdit={() => onEditReply(review._id, review.reply)}
              onDelete={() => onDeleteReply(review._id, review.reply._id)}
              isOwner={
                currentUser && currentUser.userId === review.reply.ownerId._id
              }
            />
          )}
      </div>

      <div>
        {currentUser &&
          currentUser.role === "owner" &&
          currentUser.userId === warehouse.ownerId._id && (
            <button
              title={
                review.reply &&
                typeof review.reply.text === "string" &&
                review.reply.text.trim() !== ""
                  ? "You have already replied."
                  : ""
              }
              disabled={
                !!(
                  review.reply &&
                  typeof review.reply.text === "string" &&
                  review.reply.text.trim() !== ""
                )
              }
              onClick={() => onReply(review)}
              className={`text-blue-500 ${
                review.reply &&
                typeof review.reply.text === "string" &&
                review.reply.text.trim() !== ""
                  ? "opacity-50 cursor-not-allowed"
                  : ""
              }`}
            >
              Reply
            </button>
          )}
      </div>
    </div>
  );
};

const ReviewList = ({ reviews, onEditReview, onDeleteReview, warehouse }) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [currentUser, setCurrentUser] = useState(null);
  const storedToken = useAuth();
  const [editingReply, setEditingReply] = useState(null);

  useEffect(() => {
    fetchCurrentUser();
  }, [storedToken]);

  const fetchCurrentUser = async () => {
    if (storedToken) {
      try {
        const decodedToken = await jwtDecode(storedToken);
        setCurrentUser(decodedToken);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
  };

  const handleEditReply = (reviewId, reply) => {
    setSelectedReview({ _id: reviewId });
    setEditingReply(reply);
    setShowReplyForm(true);
  };

  const handleDeleteReply = async (reviewId, replyId) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/reviews/reply/${reviewId}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: currentUser.userId,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete reply");
      }

      const data = await response.json();
      showSuccessToast(data.message);
      // Refresh the reviews or update the state to reflect the deleted reply
      // This could be done by calling a function passed as a prop to update the parent component's state
    } catch (error) {
      showErrorToast("Failed to delete reply");
    }
  };

  const handleReplySubmit = async (replyData) => {
    if (editingReply) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/reviews/reply/${selectedReview._id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: replyData,
              userId: currentUser.userId,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to update reply");
        }

        const data = await response.json();
        showSuccessToast(data.message);
        setEditingReply(null);
        // Refresh the reviews or update the state to reflect the updated reply
      } catch (error) {
        showErrorToast("Failed to update reply");
      }
    } else {
      handleReplyReview(replyData, selectedReview);
    }
    setShowReplyForm(false);
  };

  const handleReplyReview = async (replyData, selectedReview) => {
    console.log(replyData, selectedReview);

    if (!selectedReview) {
      console.error("No review selected for reply.");
      return;
    }

    try {
      const response = await fetch(
        `${API_BASE_URL}/reviews/reply/${selectedReview._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: replyData, userId: currentUser.userId }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit reply");
      }

      const data = await response.json();
      showSuccessToast(data.message);
      setShowReplyForm(false);
      // Refresh the reviews or update the state to reflect the new reply
    } catch (error) {
      showErrorToast("Failed to reply");
    }
  };

  const handleReplyClick = (review) => {
    setSelectedReview(review);
    setEditingReply(null);
    setTimeout(() => setShowReplyForm(true), 100);
  };

  return reviews.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
      {reviews.map((review, index) => (
        <ReviewCard
          key={index}
          review={review}
          onEdit={onEditReview}
          onDelete={onDeleteReview}
          warehouse={warehouse}
          onReply={handleReplyClick}
          onEditReply={handleEditReply}
          onDeleteReply={handleDeleteReply}
        />
      ))}

      <ReplyModal
        isOpen={showReplyForm}
        onClose={() => {
          setShowReplyForm(false);
          setEditingReply(null);
        }}
        onSubmit={handleReplySubmit}
        initialReply={editingReply ? editingReply.text : ""}
      />
    </div>
  ) : (
    <div className="flex justify-center text-gray-600">
      <p>Oops! No reviews yet. Be the first one to review.</p>
    </div>
  );
};

export default ReviewList;
