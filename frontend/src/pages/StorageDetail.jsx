import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import {
  ArrowLeft,
  Grid,
  Heart,
  MapPin,
  Plus,
  Share2,
  Star,
  User,
} from "lucide-react";
import "leaflet/dist/leaflet.css";
import { useLocation, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import ReviewModal from "../components/ReviewModal";
import ReviewList from "../components/ReviewList";
import { showErrorToast, showSuccessToast } from "../components/toast";
import ShareModal from "../components/ShareModal";
import AllReviewsModal from "../components/AllReviews";
import ImageGrid from "../components/ImageGrid";
import PhotoGallery from "../components/PhotoGallery";
import UploadModal from "../components/UploadModal";

const StorageDetail = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const location = useLocation();
  const { warehouse } = location.state;
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);

  const [user, setUser] = useState({});
  const [reviews, setReviews] = useState([]);
  const [booked, setIsBooked] = useState(false);
  const [isAllReviewModalOpen, setIsAllReviewModalOpen] = useState(false);
  const [reviewStats, setReviewStats] = useState({});
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

      const totalReviews = data.reviews.length;
      const ratingCounts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
      let totalRating = 0;

      data.reviews.forEach((review) => {
        totalRating += review.ratings;
        ratingCounts[review.ratings] = (ratingCounts[review.ratings] || 0) + 1;
      });

      const averageRating = totalReviews
        ? (totalRating / totalReviews).toFixed(2)
        : 0;

      setReviewStats({
        averageRating: parseFloat(averageRating),
        totalReviews: totalReviews,
        ratingCounts: ratingCounts,
      });
    } catch (error) {
      console.error("Error fetching reviews", error);
    }
  };

  const calculateDuration = (dateString) => {
    const currentDate = new Date();
    const targetDate = new Date(dateString);
    const difference = currentDate - targetDate;

    const totalDays = difference / (1000 * 60 * 60 * 24);
    const totalMonths = difference / (1000 * 60 * 60 * 24 * 30);
    const totalYears = difference / (1000 * 60 * 60 * 24 * 365);

    if (currentDate.getMonth() === targetDate.getMonth()) {
      return `${Math.round(totalDays)} day(s)`;
    } else if (totalMonths < 12) {
      return `${Math.round(totalMonths)} month(s)`;
    } else {
      return `${Math.round(totalYears)} year(s)`;
    }
  };

  const [isFavorite, setIsFavorite] = useState(false);

  const handleFavorite = async (e) => {
    try {
      e.stopPropagation();
      setIsFavorite(!isFavorite);

      const response = await fetch(
        `http://localhost:8080/api/wishlists/add/${warehouse._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.userId,
          }),
        }
      );
      if (!response.ok) {
        console.log("Couldn't wishlist this warehouse currently.");
        return;
      }
      const data = await response.json();

      showSuccessToast(data.message);
    } catch (error) {
      showErrorToast("Couldn't wishlist this warehouse currently.");
    }
  };

  const checkIsWishlisted = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/wishlists/checkStatus/${warehouse._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.userId,
          }),
        }
      );
      if (!response.ok) {
        console.log("Couldn't fetch wishlist status.");
        return;
      }
      const data = await response.json();

      if (data.wishlisted) {
        setIsFavorite(true);
      }
    } catch (error) {
      showErrorToast("Couldn't wishlist this warehouse currently.");
    }
  };

  useEffect(() => {
    checkIsWishlisted();
  }, [warehouse._id, user.userId]);

  const handleRemoveFavorite = async () => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/wishlists/remove/${warehouse._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: user.userId,
          }),
        }
      );
      if (!response.ok) {
        console.log("Couldn't remove warehouse from wishlist.");
        return;
      }
      const data = await response.json();
      showSuccessToast(data.message);
      setIsFavorite(false);
    } catch (error) {
      showErrorToast("Couldn't wishlist this warehouse currently.");
    }
  };

  const [showGallery, setShowGallery] = useState(false);

  const handleUpload = async (files) => {
    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("image", file);
      });

      const response = await fetch(
        `http://localhost:8080/api/warehouses/${warehouse._id}/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        console.error("Failed to upload image.");
        return;
      }

      const data = await response.json();
      console.log(data.message);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
      <div className="flex items-center justify-between md:gap-4 gap-2 mb-4 sm:mb-8">
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate(-1)}
            className="md:p-2 mt-[2.5px] rounded-full hover:bg-gray-50 transition-colors duration-200"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-xl sm:text-3xl font-semibold text-gray-900">
            {warehouse.name}
          </h1>
        </div>
        <div className="flex shrink md:hidden">
          <button
            className="p-2 hover:bg-gray-100 rounded-full"
            onClick={() => setIsShareModalOpen(true)}
          >
            <Share2 className="w-5 h-5" />
          </button>
          <button
            onClick={isFavorite ? handleRemoveFavorite : handleFavorite}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <Heart
              className={`w-5 h-5 ${
                isFavorite ? "fill-red-500 stroke-red-500" : "stroke-gray-900"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Image Grid */}
      <div className="mb-6">
        <div className="overflow-hidden rounded-lg">
          <ImageGrid
            images={warehouse.images}
            onShowAllPhotos={() => setShowGallery(true)}
            onAddMoreImages={() => setIsUploadModalOpen(true)}
            isOwner={warehouse.ownerId._id === user.userId ? true : false}
          />
        </div>
        {isUploadModalOpen && (
          <UploadModal
            isOpen={isUploadModalOpen}
            onClose={() => setIsUploadModalOpen(false)}
            onUpload={handleUpload}
          />
        )}
        {showGallery && (
          <PhotoGallery
            images={warehouse.images}
            onClose={() => setShowGallery(false)}
          />
        )}
      </div>

      {/* Details Section */}
      <div
        className={`mt-6 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-12 ${
          warehouse.ownerId._id !== user.userId
            ? "border-b pb-6"
            : "lg:grid-cols-2"
        }`}
      >
        <div className="lg:col-span-2">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                {warehouse.name}
              </h1>
              <p className="mt-2 text-sm sm:text-base text-gray-600 flex items-start md:items-center">
                <MapPin className="w-4 h-4 mr-1 mt-1 flex-shrink-0" />
                <span className="break-words">
                  {warehouse.location.formattedAddress}
                </span>
              </p>
            </div>
            <div className="flex md:flex hidden">
              <button
                className="p-2 hover:bg-gray-100 rounded-full"
                onClick={() => setIsShareModalOpen(true)}
              >
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={isFavorite ? handleRemoveFavorite : handleFavorite}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <Heart
                  className={`w-5 h-5 ${
                    isFavorite
                      ? "fill-red-500 stroke-red-500"
                      : "stroke-gray-900"
                  }`}
                />
              </button>
            </div>
          </div>

          <ShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            listing={warehouse}
          />

          <div className="py-4 border-t border-b">
            <div className="flex items-center gap-2">
              <a href={`/users/o/show/${warehouse.ownerId._id}`}>
                <img
                  src={warehouse.ownerId.avatar || "/placeholder.svg"}
                  alt={warehouse.ownerId.name}
                  className="w-10 h-10 object-cover rounded-full"
                />
              </a>
              <div>
                <p className="font-medium">
                  Listed by{" "}
                  {warehouse.ownerId._id === user.userId
                    ? "you"
                    : warehouse.ownerId.name}
                </p>
                <p className="text-sm text-gray-600">
                  {calculateDuration(warehouse.ownerId.createdAt)} on Sanjeevani
                </p>
              </div>
            </div>
          </div>

          <div className="py-4 border-b">
            <h2 className="text-xl font-semibold mb-2">
              About this storage space
            </h2>
            <p className="text-gray-600 leading-relaxed">
              {warehouse.description}
            </p>
          </div>

          <div className="py-4">
            <h2 className="text-xl font-semibold mb-2">Storage Details</h2>
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
            <div className="sticky top-20 bg-white p-4 sm:p-6 rounded-xl border shadow-sm">
              <div className="flex justify-between items-center mb-4 sm:mb-6">
                <div>
                  <p className="text-xl sm:text-2xl font-semibold">
                    ₹{warehouse.pricePerDay}
                  </p>
                  <p className="text-sm text-gray-600">per day</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs sm:text-sm ${
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

              <button
                onClick={() =>
                  navigate("/book/warehouse", { state: { warehouse } })
                }
                className={`w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors ${
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
            </div>
          )}
        </div>
      </div>

      {/* Review */}
      <div className="mt-8">
        <p className="text-2xl font-semibold mb-12 text-center">Reviews</p>

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

        {reviews && reviews.length > 0 && (
          <div className="flex justify-center md:justify-start mt-4">
            <button
              onClick={() => setIsAllReviewModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 text-sm sm:text-base"
            >
              <Star className="h-4 w-4 sm:h-5 sm:w-5" />
              {reviewStats.averageRating} ({reviewStats.totalReviews} reviews)
            </button>
          </div>
        )}

        <AllReviewsModal
          isOpen={isAllReviewModalOpen}
          onClose={() => setIsAllReviewModalOpen(false)}
          reviews={reviews}
          stats={reviewStats}
        />

        {booked && user.userId !== warehouse.ownerId._id && (
          <div className="flex justify-center items-center mt-4">
            <button
              onClick={() => setIsModalOpen(true)}
              className="py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Add Review
            </button>
          </div>
        )}
        {!booked && user.userId !== warehouse.ownerId._id && (
          <div className="flex justify-center items-center mt-4 text-gray-600 text-sm sm:text-base">
            Book this storage to add reviews.
          </div>
        )}
      </div>

      {/* Map Section */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">
          Where your storage will be
        </h2>
        <p className="mb-4 text-sm sm:text-base text-gray-600">
          {warehouse.location.city && `${warehouse.location.city}, `}
          {warehouse.location.state && `${warehouse.location.state}, `}
          {warehouse.location.country}
        </p>
        <div className="h-[300px] sm:h-[400px] rounded-xl overflow-hidden">
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
