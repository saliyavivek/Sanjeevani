import React, { useState, useEffect } from "react";
import {
  ArrowLeft,
  Share,
  Heart,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const PhotoGallery = ({ images, onClose }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    // Implement share functionality
    console.log("Share clicked");
  };

  const openFullScreen = (index) => {
    setSelectedIndex(index);
  };

  const closeFullScreen = () => {
    setSelectedIndex(null);
  };

  const navigateImage = (direction) => {
    const newIndex = selectedIndex + direction;
    if (newIndex >= 0 && newIndex < images.length) {
      setSelectedIndex(newIndex);
    }
  };

  if (selectedIndex !== null) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
        <button
          onClick={closeFullScreen}
          className="absolute top-4 left-4 text-white hover:bg-white/10 rounded-full p-2 z-50"
        >
          <X className="w-6 h-6" />
        </button>

        <button
          onClick={() => navigateImage(-1)}
          className={`absolute left-4 text-white hover:bg-white/10 p-2 rounded-full ${
            selectedIndex === 0 ? "opacity-50" : "opacity-100"
          }`}
          disabled={selectedIndex === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <img
          src={images[selectedIndex] || "/placeholder.svg"}
          alt={`Photo ${selectedIndex + 1}`}
          className="w-full h-full object-contain"
        />

        <button
          onClick={() => navigateImage(1)}
          className={`absolute right-4 text-white hover:bg-white/10 p-2 rounded-full ${
            selectedIndex === images.length - 1 ? "opacity-50" : "opacity-100"
          }`}
          disabled={selectedIndex === images.length - 1}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white text-sm">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>
    );
  }

  const renderMobileGallery = () => (
    <div className="mt-14 pb-6">
      <div className="space-y-1">
        {/* Hero Image */}
        <div className="w-full aspect-[4/3]" onClick={() => openFullScreen(0)}>
          <img
            src={images[0] || "/placeholder.svg"}
            alt="Main view"
            className="w-full h-full object-cover"
          />
        </div>

        {/* 2x2 Grid */}
        <div className="grid grid-cols-2 gap-1">
          {images.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className="aspect-square"
              onClick={() => openFullScreen(index + 1)}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`View ${index + 2}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        {/* Remaining Images */}
        {images.slice(5).map((image, index) => (
          <div
            key={index}
            className="w-full aspect-[4/3]"
            onClick={() => openFullScreen(index + 5)}
          >
            <img
              src={image || "/placeholder.svg"}
              alt={`View ${index + 6}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );

  const renderDesktopGallery = () => (
    <div className="h-[calc(100vh-4rem)] overflow-y-auto p-20">
      {/* Photo Tour Section */}
      <div className="px-8 py-6">
        <h2 className="text-2xl font-semibold mb-4">Photo tour</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
          {images.map((image, index) => (
            <div
              key={index}
              className="flex-none snap-start"
              onClick={() => openFullScreen(index)}
            >
              <div className="w-72 h-48 relative">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`Tour photo ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg cursor-pointer"
                />
              </div>
              {/* <p className="mt-2 text-sm">Photo {index + 1}</p> */}
            </div>
          ))}
        </div>
      </div>

      {/* Full Photos Section */}
      <div className="px-8 pb-8">
        {images.map((image, index) => (
          <div key={index} className="mb-6">
            {/* <h3 className="text-2xl font-semibold mb-4">Photo {index + 1}</h3> */}
            <div
              className="h-full relative"
              onClick={() => openFullScreen(index)}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`Full photo ${index + 1}`}
                className="w-full h-full object-cover rounded-lg cursor-pointer"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 px-4 py-3 flex justify-between items-center z-10 bg-white border-b">
        <button
          onClick={onClose}
          className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${
              !isMobile && "flex items-center gap-2 px-4 py-2"
            }`}
          >
            <Share className="w-5 h-5" />
            {!isMobile && <span>Share</span>}
          </button>
          <button
            onClick={handleSave}
            className={`p-2 hover:bg-gray-100 rounded-full transition-colors ${
              !isMobile && "flex items-center gap-2 px-4 py-2"
            }`}
          >
            <Heart
              className={`w-5 h-5 ${
                isSaved ? "fill-red-500 stroke-red-500" : ""
              }`}
            />
            {!isMobile && <span>Save</span>}
          </button>
        </div>
      </div>

      {/* Gallery Content */}
      {isMobile ? renderMobileGallery() : renderDesktopGallery()}
    </div>
  );
};

export default PhotoGallery;
