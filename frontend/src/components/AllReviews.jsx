import React from "react";
import { Star, X } from "lucide-react";

const AllReviewsModal = ({ isOpen, onClose, reviews, stats }) => {
  if (!isOpen) return null;

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      year: "numeric",
    }).format(new Date(date));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center">
      <div className="bg-white w-full max-w-5xl min-h-screen md:min-h-[90%] md:my-8 md:rounded-xl relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute left-4 top-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid md:grid-cols-12 gap-8 px-14 pt-20 pb-4">
          {/* Left Column - Overall Rating */}
          <div className="md:col-span-4 lg:col-span-4">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Star className="h-8 w-8 fill-current" />
                <span className="text-4xl font-semibold">
                  {stats.averageRating}
                </span>
              </div>

              <div className="space-y-1">
                <h3 className="text-lg font-medium mb-2">Overall rating</h3>
                {[5, 4, 3, 2, 1].map((rating) => (
                  <div key={rating} className="flex items-center gap-2 h-3">
                    <span className="w-2 text-xs">{rating}</span>
                    <div className="flex-1 h-1 bg-gray-300 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gray-900 rounded-full"
                        style={{
                          width: `${
                            (stats.ratingCounts[rating] / stats.totalReviews) *
                            100
                          }%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Reviews */}
          <div className="md:col-span-8 lg:col-span-8">
            <h2 className="text-2xl font-semibold mb-6">
              {stats.totalReviews} reviews
            </h2>

            <div className="space-y-8 overflow-scroll max-h-[530px]">
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className="border-b last:border-b-0 pb-8 last:pb-0"
                >
                  <div className="flex items-start gap-4">
                    <a href={`/users/f/show/${review.userId._id}`}>
                      <img
                        src={
                          review.userId.avatar ||
                          "/placeholder.svg?height=40&width=40"
                        }
                        alt={review.userName}
                        className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                      />
                    </a>
                    <div className="flex-1 min-w-0">
                      <div>
                        <h3 className="font-medium">{review.userId.name}</h3>
                        <p className="text-gray-600">{review.userId.address}</p>
                      </div>
                      <div className="flex items-center gap-2 mt-1 mb-2">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3 w-3 ${
                                i < review.ratings
                                  ? "text-black fill-current"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-gray-500">·</span>
                        <time className="text-gray-500">
                          {formatDate(review.createdAt)}
                        </time>
                      </div>
                      <p className="text-gray-700">{review.review}</p>

                      {/* Host Response */}
                      {/* {review.hostResponse && (
                        <div className="mt-4 pl-4 border-l-2 border-gray-200">
                          <div className="flex items-center gap-2 mb-2">
                            <img
                              src={
                                review.hostResponse.avatar ||
                                "/placeholder.svg?height=32&width=32"
                              }
                              alt={review.hostResponse.name}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <div>
                              <p className="font-medium">
                                Response from {review.hostResponse.name}
                              </p>
                              <time className="text-sm text-gray-500">
                                {formatDate(review.hostResponse.date)}
                              </time>
                            </div>
                          </div>
                          <p className="text-gray-700">
                            {review.hostResponse.text}
                          </p>
                        </div>
                      )} */}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllReviewsModal;
