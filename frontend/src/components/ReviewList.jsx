import React, { useState, useEffect } from "react";
import { Star, MoreVertical, Dot } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import ReviewOptionsMenu from "./ReviewOptionsMenu";
import { formatDistanceToNow } from "date-fns";
import useAuth from "../hooks/useAuth";
import ReplyModal from "./ReplyModal";
import { showErrorToast, showSuccessToast } from "./toast";
import ReviewReply from "./ReviewReply";

const ReviewCard = ({ review, onEdit, onDelete, warehouse, onReply }) => {
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
        // console.log(decodedToken);
        setCurrentUser(decodedToken);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
  };

  const isCurrentUserReview =
    currentUser && currentUser.userId === review.userId._id;

  // if (currentUser) {
  //   console.log(currentUser, warehouse);
  // }

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
    <div className="mb-8 relative">
      <div className="flex items-center mb-4">
        <div className="relative">
          <a href={`/users/f/show/${review.userId._id}`}>
            {review.userId.avatar ? (
              <img
                src={review.userId.avatar}
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
            <ReviewReply reply={review.reply} />
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

  // console.log(reviews);

  useEffect(() => {
    fetchCurrentUser();
  }, [storedToken]);

  const fetchCurrentUser = async () => {
    if (storedToken) {
      try {
        const decodedToken = await jwtDecode(storedToken);
        // console.log(decodedToken);
        setCurrentUser(decodedToken);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
  };

  const handleReplyReview = async (replyData, selectedReview) => {
    if (!selectedReview) {
      console.error("No review selected for reply.");
      return;
    }

    // console.log("Replying to:", selectedReview._id);
    // console.log("Reply Text:", replyData);

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
    } catch (error) {
      showErrorToast("Failed to reply");
    }
  };

  const handleReplyClick = (review) => {
    setSelectedReview(review); // Set the review data first
    setTimeout(() => setShowReplyForm(true), 100); // Delay modal opening to ensure state update
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
        />
      ))}

      <ReplyModal
        isOpen={showReplyForm}
        onClose={() => {
          setShowReplyForm(false);
        }}
        onSubmit={(replyData) => {
          handleReplyReview(replyData, selectedReview);
        }}
      />
    </div>
  ) : (
    <div className="flex justify-center text-gray-600">
      <p>Oops! No reviews yet. Be the first one to review.</p>
    </div>
  );
};

export default ReviewList;
