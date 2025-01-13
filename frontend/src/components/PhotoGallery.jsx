import React, { useState } from "react";
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
      <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
        <button
          onClick={closeFullScreen}
          className="absolute top-4 left-4 text-black hover:bg-gray-50 rounded-full p-2 z-50"
        >
          <X className="w-6 h-6" />
        </button>

        <button
          onClick={() => navigateImage(-1)}
          className="absolute left-4 text-black hover:bg-gray-50 p-2 rounded-full bg-white/50"
          disabled={selectedIndex === 0}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <img
          src={images[selectedIndex]}
          alt={`Photo ${selectedIndex + 1}`}
          className="max-h-[500px] max-w-full object-contain"
        />

        <button
          onClick={() => navigateImage(1)}
          className="absolute right-4 text-black hover:bg-gray-50 p-2 rounded-full bg-white/50"
          disabled={selectedIndex === images.length - 1}
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white">
          {selectedIndex + 1} / {images.length}
        </div>
      </div>
    );
  }

  return (
    // <div className="fixed inset-0 bg-white z-50 overflow-hidden">
    //   {/* Header */}
    //   <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-white border-b">
    //     <button
    //       onClick={onClose}
    //       className="p-2 hover:bg-gray-100 rounded-full transition-colors"
    //     >
    //       <ArrowLeft className="w-6 h-6" />
    //     </button>

    //     <div className="flex items-center gap-4">
    //       <button
    //         onClick={handleShare}
    //         className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
    //       >
    //         <Share className="w-5 h-5" />
    //         <span>Share</span>
    //       </button>
    //       <button
    //         onClick={handleSave}
    //         className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
    //       >
    //         <Heart
    //           className={`w-5 h-5 ${
    //             isSaved ? "fill-red-500 stroke-red-500" : ""
    //           }`}
    //         />
    //         <span>Save</span>
    //       </button>
    //     </div>
    //   </div>

    //   {/* Photo Grid */}
    //   <div className="mt-24 mx-20 px-4 pb-16 h-[calc(100vh-4rem)] overflow-y-auto">
    //     <div className="gap-4 space-y-4">
    //       {images.map((image, index) => (
    //         <div
    //           key={index}
    //           className="relative break-inside-avoid-column"
    //           onClick={() => openFullScreen(index)}
    //         >
    //           <img
    //             src={image}
    //             alt={`Photo ${index + 1}`}
    //             className="w-full h-auto rounded-lg cursor-pointer"
    //           />
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </div>
    <div className="fixed inset-0 bg-white z-50 overflow-hidden">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 p-4 flex justify-between items-center z-10 bg-white border-b">
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>

        <div className="flex items-center gap-4">
          <button
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Share className="w-5 h-5" />
            <span>Share</span>
          </button>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Heart
              className={`w-5 h-5 ${
                isSaved ? "fill-red-500 stroke-red-500" : ""
              }`}
            />
            <span>Save</span>
          </button>
        </div>
      </div>

      <div className="h-[calc(100vh-4rem)] overflow-y-auto p-20">
        {/* Photo Tour Section */}
        <div className="px-8 py-6">
          <h2 className="text-2xl font-semibold mb-4">Photo tour</h2>
          <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
            {images.map((image, index) => (
              <div
                key={image.id}
                className="flex-none snap-start"
                onClick={() => openFullScreen(index)}
              >
                <div className="w-72 h-48 relative">
                  <img
                    src={image}
                    alt={image.title}
                    className="w-full h-full object-cover rounded-lg cursor-pointer"
                  />
                </div>
                <p className="mt-2 text-sm">{image.title}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Full Photos Section */}
        <div className="px-8 pb-8">
          {images.map((image, index) => (
            <div key={image.id} className="mb-6">
              <h3 className="text-2xl font-semibold mb-4">{image.title}</h3>
              <div
                className="h-full relative"
                onClick={() => openFullScreen(index)}
              >
                <img
                  src={image}
                  alt={image.title}
                  className="w-full h-full object-cover rounded-lg cursor-pointer"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PhotoGallery;
