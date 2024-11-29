import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Grid, MapPin, Share2, User } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { useLocation } from "react-router-dom";

const StorageDetail = () => {
  // const [showAllPhotos, setShowAllPhotos] = useState(false);
  const location = useLocation();
  const { warehouse } = location.state;
  // console.log(warehouse);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Image Grid */}
      <div className="relative">
        <div className="relative overflow-hidden">
          <img
            src={warehouse.images[0]}
            alt="Main storage view"
            className="w-full h-[500px] object-cover rounded-xl"
          />
        </div>
        {/* <button
          onClick={() => setShowAllPhotos(true)}
          className="absolute bottom-4 right-4 bg-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md hover:bg-gray-50"
        >
          <Grid className="w-4 h-4" />
          Show all photos
        </button> */}
      </div>

      {/* Details Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-semibold text-gray-900">
                {warehouse.name}
              </h1>
              <p className="mt-2 text-gray-600 flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                {warehouse.location.formattedAddress}
              </p>
            </div>
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <Share2 className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-6 pb-6 border-b">
            <div className="flex items-center gap-4">
              <User className="w-10 h-10 p-2 bg-gray-100 rounded-full" />
              <div>
                <p className="font-medium">
                  Listed by {warehouse.ownerId.name}
                </p>
                <p className="text-gray-600">Storage Owner</p>
              </div>
            </div>
          </div>

          <div className="py-6 border-b">
            <h2 className="text-xl font-semibold mb-4">
              About this storage space
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {warehouse.description}
            </p>
          </div>

          <div className="py-6">
            <h2 className="text-xl font-semibold mb-4">Storage Details</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Size</p>
                <p className="text-gray-600">{warehouse.size} sq ft.</p>
              </div>
              <div>
                <p className="font-medium">Price</p>
                <p className="text-gray-600">
                  ₹{warehouse.pricePerMonth} per month
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="sticky top-8 bg-white p-6 rounded-xl border shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-2xl font-semibold">
                  ₹{warehouse.pricePerMonth}
                </p>
                <p className="text-gray-600">per month</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm ${
                  warehouse.availability
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {warehouse.availability ? "Available" : "Sold out"}
              </span>
            </div>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700">
              Book Now
            </button>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Where your storage will be
        </h2>
        <p className="mb-4 text-gray-600">
          {warehouse.location.city}, {warehouse.location.state},{" "}
          {warehouse.location.country}
        </p>
        <div className="h-[400px] rounded-xl overflow-hidden">
          <MapContainer
            center={warehouse.location.coordinates.slice().reverse()}
            zoom={13}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={warehouse.location.coordinates.slice().reverse()}>
              <Popup>
                {warehouse.name}
                <br />
                {warehouse.location.formattedAddress}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default StorageDetail;
