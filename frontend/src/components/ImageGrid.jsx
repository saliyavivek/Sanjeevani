import React from "react";
import { Grid, Plus } from "lucide-react";

const ImageGrid = ({ images, onShowAllPhotos, onAddMoreImages, isOwner }) => {
  const imageCount = images.length;
  // console.log(imageCount);

  const renderGrid = () => {
    switch (imageCount) {
      case 1:
        return (
          <div className="relative h-[350px] rounded-xl overflow-hidden">
            <img
              src={images[0]}
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
              <div key={index} className="relative overflow-hidden">
                <img
                  src={image}
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
                src={images[0]}
                alt="Main view"
                className="w-full h-full object-cover"
              />
            </div>
            {images.slice(1, 3).map((image, index) => (
              <div key={index} className="relative overflow-hidden">
                <img
                  src={image}
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
                  src={image}
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
                src={images[0]}
                alt="Main view"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-2 grid grid-cols-2 gap-2">
              {images.slice(1, 5).map((image, index) => (
                <div key={index} className="relative overflow-hidden">
                  <img
                    src={image}
                    alt={`View ${index + 2}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
              {renderButtons()}
            </div>
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

  return <div className="relative">{renderGrid()}</div>;
};

export default ImageGrid;
