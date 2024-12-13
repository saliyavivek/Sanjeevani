import React, { useState, useEffect } from "react";
import { Star, MoreVertical, Dot } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import ReviewOptionsMenu from "./ReviewOptionsMenu";

const ReviewCard = ({ review, onEdit, onDelete }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const shouldShowMore = review.review.length > 150;

  useEffect(() => {
    const fetchCurrentUser = () => {
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        try {
          const decodedToken = jwtDecode(storedToken);
          setCurrentUser(decodedToken.userId);
        } catch (error) {
          console.error("Invalid token", error);
          localStorage.removeItem("token");
        }
      }
    };
    fetchCurrentUser();
  }, []);

  const isCurrentUserReview = currentUser === review.userId._id;

  return (
    <div className="mb-8 relative">
      <div className="flex items-center mb-4">
        <div className="relative">
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
        </div>
        <div className="ml-4 flex-grow">
          <h3 className="font-semibold text-gray-900">{review.userId.name}</h3>
          <div className="flex items-center text-sm text-black-500">
            <span>1 year on Sanjeevani</span>
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
        <span className="ml-1 text-xs">&#x2022;</span>
        <span className="ml-1 text-sm text-gray-500">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="text-gray-700">
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
    </div>
  );
};

const ReviewList = ({ reviews, onEditReview, onDeleteReview }) => {
  return reviews.length > 0 ? (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
      {reviews.map((review, index) => (
        <ReviewCard
          key={index}
          review={review}
          onEdit={onEditReview}
          onDelete={onDeleteReview}
        />
      ))}
    </div>
  ) : (
    <div className="flex justify-center text-gray-600">
      <p>No reviews yet. It will appear below when available.</p>
    </div>
  );
};

export default ReviewList;
