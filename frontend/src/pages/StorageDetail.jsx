import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Grid, MapPin, Share2, User } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ReviewModal from "../components/ReviewModal";
import ReviewList from "../components/ReviewList";
import { showErrorToast, showSuccessToast } from "../components/toast";

const StorageDetail = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const location = useLocation();
  const { warehouse } = location.state;

  const [user, setUser] = useState({});
  const [reviews, setReviews] = useState([]);
  const [booked, setIsBooked] = useState(false);
  const navigate = useNavigate();

  const fetchCurrentUser = async () => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        setUser(decodedToken);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
  };

  const fetchBookingStatus = async () => {
    const response = await fetch(
      "http://localhost:8080/api/bookings/isBookedByUser",
      {
        method: "POST",
        body: JSON.stringify({
          userId: user.userId,
          warehouseId: warehouse._id,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // if (!response.ok) {
    //   console.error("Failed to fetch booking status.");
    //   return;
    // }
    const data = await response.json();

    setIsBooked(data.message === true);
  };

  useEffect(() => {
    fetchCurrentUser();
    fetchReviews();
  }, []);

  useEffect(() => {
    fetchBookingStatus();
  }, [user]);

  const handleSubmit = async (reviewData) => {
    const url = editingReview
      ? `http://localhost:8080/api/reviews/${editingReview._id}`
      : "http://localhost:8080/api/reviews/";
    const method = editingReview ? "PUT" : "POST";

    const response = await fetch(url, {
      method: method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: user.userId,
        ratings: reviewData.rating,
        review: reviewData.review,
        warehouseId: warehouse._id,
      }),
    });

    if (!response.ok) {
      showErrorToast("Failed to add review.");
      // console.error("Failed to submit review");
      return;
    }
    const data = await response.json();
    showSuccessToast(data.message);

    setIsModalOpen(false);
    setEditingReview(null);
    fetchReviews();
  };

  const handleEditReview = (review) => {
    setEditingReview(review);
    setIsModalOpen(true);
  };

  const handleDeleteReview = async (reviewId) => {
    const response = await fetch(
      `http://localhost:8080/api/reviews/${reviewId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      console.error("Failed to delete review");
      return;
    }

    const data = await response.json();
    showSuccessToast(data.message);
    fetchReviews();
  };

  const fetchReviews = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/reviews/${warehouse._id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to fetch reviews");
        return;
      }

      const data = await response.json();
      setReviews(data.reviews);
    } catch (error) {
      console.error("Error fetching reviews", error);
    }
  };

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
      <div
        className={
          warehouse.ownerId._id !== user.userId
            ? "mt-8 grid grid-cols-1 lg:grid-cols-3 gap-12 border-b pb-5"
            : "mt-8 grid grid-cols-1 lg:grid-cols-1 gap-12"
        }
      >
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
                  Listed by{" "}
                  {warehouse.ownerId._id === user.userId
                    ? "you"
                    : warehouse.ownerId.name}
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
                  ₹{warehouse.pricePerDay} per day
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          {warehouse.ownerId._id !== user.userId && (
            <div className="sticky top-8 bg-white p-6 rounded-xl border shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <p className="text-2xl font-semibold">
                    ₹{warehouse.pricePerDay}
                  </p>
                  <p className="text-gray-600">per day</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    warehouse.availability === "available"
                      ? "bg-green-100 text-green-800"
                      : warehouse.availability === "booked"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {warehouse.availability === "available"
                    ? "Available"
                    : warehouse.availability === "booked"
                    ? "Booked"
                    : "Under Maintenance"}
                </span>
              </div>

              {/* <a href="/book/warehouse"> */}
              <button
                onClick={() =>
                  navigate("/book/warehouse", { state: { warehouse } })
                }
                className={`w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 ${
                  warehouse.availability === "booked" ||
                  warehouse.availability === "maintenance"
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }`}
                disabled={
                  warehouse.availability === "booked" ||
                  warehouse.availability === "maintenance"
                }
              >
                {warehouse.availability === "available"
                  ? "Book Now"
                  : warehouse.availability === "booked"
                  ? "Booked"
                  : "Under Maintenance"}
              </button>
              {/* </a> */}
            </div>
          )}
        </div>
      </div>

      {/* Review */}
      <div>
        <p className="text-2xl font-semibold mb-4 flex items-center justify-center pt-4">
          Reviews
        </p>

        <ReviewModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingReview(null);
          }}
          onSubmit={handleSubmit}
          editReview={editingReview}
        />
        <ReviewList
          reviews={reviews}
          onEditReview={handleEditReview}
          onDeleteReview={handleDeleteReview}
        />

        {/* {console.log(booked)} */}
        {booked && user.userId !== warehouse.ownerId._id && (
          <div className="flex justify-center items-center">
            <button
              onClick={() => setIsModalOpen(true)}
              className="py-2 px-4 rounded hover:bg-gray-100"
            >
              Add Review
            </button>
          </div>
        )}
        {!booked && user.userId !== warehouse.ownerId._id && (
          <div className="flex justify-center items-center">
            Book this storage to add reviews.
          </div>
        )}
      </div>

      {/* Map Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Where your storage will be
        </h2>
        <p className="mb-4 text-gray-600">
          {warehouse.location.city && `${warehouse.location.city}, `}
          {warehouse.location.state && `${warehouse.location.state}, `}
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
