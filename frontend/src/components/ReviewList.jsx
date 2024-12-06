import React, { useState } from "react";
import { Star } from "lucide-react";

const ReviewCard = ({ review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const shouldShowMore = review.review.length > 150;

  return (
    <div className="mb-8">
      <div className="flex items-center mb-4">
        {/* <div className="relative">
          {review.avatar ? (
            <img
              src={review.avatar}
              alt={`${review.name}'s profile`}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-900 flex items-center justify-center text-white text-lg font-semibold">
              {review.name.charAt(0)}
            </div>
          )}
        </div> */}
        <div className="ml-4">
          <h3 className="font-semibold text-gray-900">{review.userId.name}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <span>{review.memberSince}</span>
          </div>
        </div>
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
        <span className="ml-2 text-sm text-gray-500">
          {new Date(review.createdAt).toLocaleDateString()}
        </span>
      </div>

      <div className="text-gray-700">
        {shouldShowMore && !isExpanded ? (
          <>
            <p>{review.text.slice(0, 150)}...</p>
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

const ReviewList = ({ reviews }) => {
  console.log(reviews);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
      {reviews.map((review, index) => (
        <ReviewCard key={index} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;
