import React, { useState } from "react";
import { X } from "lucide-react";

const WishlistCard = ({ wishlist, onRemove }) => {
  const [isHovered, setIsHovered] = useState(false);

  const calculateDuration = (dateString) => {
    const currentDate = new Date();
    const targetDate = new Date(dateString);
    const difference = currentDate - targetDate;

    const totalDays = difference / (1000 * 60 * 60 * 24);
    const totalMonths = difference / (1000 * 60 * 60 * 24 * 30);
    const totalYears = difference / (1000 * 60 * 60 * 24 * 365);

    if (totalDays < 1) {
      return `Today`;
    } else if (currentDate.getMonth() === targetDate.getMonth()) {
      return `${Math.round(totalDays)} days ago`;
    } else if (totalMonths < 12) {
      return `${Math.round(totalMonths)} months ago`;
    } else {
      return `${Math.round(totalYears)} years ago`;
    }
  };

  return (
    <div
      className="group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Images Grid */}
        <div className={`grid rounded-2xl overflow-hidden aspect-square`}>
          <img
            src={wishlist.warehouse.images[0]}
            alt={wishlist.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Remove Button - Shows on Hover */}
        {isHovered && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRemove(wishlist.warehouse._id);
            }}
            className="absolute top-4 right-4 p-2 bg-white rounded-full shadow-md hover:scale-110 transition-transform duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Wishlist Info */}
      <div className="mt-3">
        <h3 className="text-lg font-medium">{wishlist.warehouse.name}</h3>
        <p className="text-gray-600 text-sm">
          {calculateDuration(wishlist.createdAt)}
        </p>
      </div>
    </div>
  );
};

export default WishlistCard;
