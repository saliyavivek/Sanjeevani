import React, { useState, useRef, useEffect } from "react";
import {
  Grid,
  Plus,
  ChevronLeft,
  ChevronRight,
  Share2,
  Heart,
} from "lucide-react";

const ImageGrid = ({ images, onShowAllPhotos, onAddMoreImages, isOwner }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const imageCount = images.length;
  const sliderRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleTouchStart = (e) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && currentImageIndex < images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
    if (isRightSwipe && currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }

    setTouchStart(0);
    setTouchEnd(0);
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  const handleNextImage = () => {
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  const renderMobileView = () => (
    <div className="relative h-[350px] w-full overflow-hidden">
      <div
        ref={sliderRef}
        className="h-full w-full"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={images[currentImageIndex] || "/placeholder.svg"}
          alt={`View ${currentImageIndex + 1}`}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={handlePrevImage}
        className={`absolute left-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md ${
          currentImageIndex === 0 ? "opacity-50" : "opacity-100"
        }`}
        disabled={currentImageIndex === 0}
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={handleNextImage}
        className={`absolute right-4 top-1/2 -translate-y-1/2 bg-white rounded-full p-1 shadow-md ${
          currentImageIndex === images.length - 1 ? "opacity-50" : "opacity-100"
        }`}
        disabled={currentImageIndex === images.length - 1}
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Image Counter */}
      <div className="absolute bottom-4 left-4 bg-black/75 text-white px-2 py-1 rounded-md text-sm">
        {currentImageIndex + 1}/{images.length}
      </div>

      {/* Action Buttons */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={onShowAllPhotos}
          className="bg-white rounded-full p-2 shadow-md"
        >
          <Grid className="w-4 h-4" />
        </button>
        {imageCount < 5 && isOwner && (
          <button
            onClick={onAddMoreImages}
            className="bg-white rounded-full p-2 shadow-md"
          >
            <Plus className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );

  const renderDesktopGrid = () => {
    switch (imageCount) {
      case 1:
        return (
          <div className="relative h-[350px] rounded-xl overflow-hidden">
            <img
              src={images[0] || "/placeholder.svg"}
              alt="Main view"
              className="w-full h-full object-cover"
            />
            {renderButtons()}
          </div>
        );
      case 2:
        return (
          <div className="grid grid-cols-2 gap-2 h-[350px] rounded-xl overflow-hidden">
            {images.map((image, index) => (
              <div key={index} className="overflow-hidden">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`View ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {renderButtons()}
          </div>
        );
      case 3:
        return (
          <div className="grid grid-cols-2 gap-2 h-[350px] rounded-xl overflow-hidden">
            <div className="row-span-2 relative overflow-hidden">
              <img
                src={images[0] || "/placeholder.svg"}
                alt="Main view"
                className="w-full h-full object-cover"
              />
            </div>
            {images.slice(1, 3).map((image, index) => (
              <div key={index} className="relative overflow-hidden">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`View ${index + 2}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {renderButtons()}
          </div>
        );
      case 4:
        return (
          <div className="grid grid-cols-2 gap-2 h-[350px] rounded-xl overflow-hidden">
            {images.map((image, index) => (
              <div key={index} className="relative overflow-hidden">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`View ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {renderButtons()}
          </div>
        );
      default:
        return (
          <div className="grid grid-cols-4 gap-2 h-[350px] rounded-xl overflow-hidden">
            <div className="col-span-2 row-span-2 relative overflow-hidden">
              <img
                src={images[0] || "/placeholder.svg"}
                alt="Main view"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-2">
              {images.slice(1, 5).map((image, index) => (
                <div key={index} className="relative overflow-hidden">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`View ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            {renderButtons()}
          </div>
        );
    }
  };

  const renderButtons = () => {
    return (
      <div className="absolute bottom-4 right-4 flex gap-2">
        <button
          onClick={onShowAllPhotos}
          className="bg-white text-black pl-3 pr-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors flex items-center gap-2"
        >
          <Grid className="w-5 h-5" />
          <span className="font-medium">Show all</span>
        </button>
        {imageCount < 5 && isOwner && (
          <button
            onClick={onAddMoreImages}
            className="bg-white text-black pl-3 pr-4 py-2 rounded-lg shadow-md hover:bg-gray-100 transition-colors flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="font-medium">Add</span>
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="relative">
      {isMobile ? renderMobileView() : renderDesktopGrid()}
    </div>
  );
};

export default ImageGrid;
