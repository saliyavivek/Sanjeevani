import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  MoreVertical,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Star,
  User2Icon,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { showErrorToast, showLoadingToast, showSuccessToast } from "./toast";

const StorageCard = ({ warehouse, onDelete, isFavorite = false }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0); // New state
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleEdit = (e) => {
    e.stopPropagation();
    navigate("/warehouse/list", { state: { existingWarehouse: warehouse } });
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
    setShowDropdown(false);
  };

  const handleDelete = async () => {
    setIsLoading(true);
    const loadingToastId = showLoadingToast("Deleting your warehouse...");
    try {
      const response = await fetch(`${API_BASE_URL}/warehouses/delete`, {
        method: "DELETE",
        body: JSON.stringify({ warehouseId: warehouse._id }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        showSuccessToast(data.message, loadingToastId);
        onDelete();
      } else {
        const errorData = await response.json();
        showErrorToast(errorData.message, loadingToastId);
        console.error("Error deleting warehouse:", errorData);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      setShowDeleteModal(false);
    }
  };

  const handleClick = () => {
    navigate(`/warehouse/${warehouse._id}`, { state: { warehouse } });
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        setUser(decodedToken.userId);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const calculateAverageRating = (warehouse) => {
    if (!warehouse.reviews || warehouse.reviews.length === 0) return 0;

    const totalRatings = warehouse.reviews.reduce(
      (acc, review) => acc + review.ratings,
      0
    );
    return (totalRatings / warehouse.reviews.length).toFixed(1);
  };

  return (
    <>
      <div
        className="relative group flex flex-col cursor-pointer"
        onMouseLeave={() => setShowDropdown(false)}
        onClick={() => handleClick()}
      >
        {/* relative is causing the issue with dropdown hiding behind the card */}
        <div className="w-full">
          {" "}
          {/* relative is causing the issue with dropdown hiding behind the card */}
          <div className="w-full overflow-hidden rounded-lg z-[-500]">
            {/* relative is causing the issue with dropdown hiding behind the card */}
            {isFavorite && (
              <div className="absolute top-3 left-3 z-10 bg-white px-3 py-1 rounded-full shadow-md">
                <p className="text-sm font-medium text-gray-900">Recommended</p>
              </div>
            )}
            <img
              src={warehouse.images[currentImageIndex] || "/placeholder.svg"}
              alt={warehouse.name}
              className="object-cover h-80 w-full z-[-500]"
            />
          </div>
          <div className="p-1 space-y-1">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
                {warehouse.name}
              </h3>
              {warehouse.reviews?.length > 0 && (
                <span className="flex items-center justify-between gap-1">
                  <Star className="w-3 h-3 text-black-400 fill-current" />
                  {calculateAverageRating(warehouse)}
                </span>
              )}
            </div>
            {warehouse.ownerId.role === "farmer" && (
              <div>
                <p className="flex items-center text-gray-700 text-sm gap-1 font-medium">
                  {/* <User2Icon className="w-3 h-3 mr-1" /> */}
                  <img
                    src={warehouse.ownerId.avatar}
                    className="w-5 h-5 object-cover rounded-full"
                  />
                  {warehouse.ownerId.name}
                </p>
              </div>
            )}
            <p className="text-md text-black-600">
              <span className="text-lg font-semibold">
                {formatPrice(warehouse.pricePerDay)}
              </span>
              <span className="text-sm text-gray-500 font-medium"> /day</span>
            </p>
            <div className="flex flex-wrap font-medium gap-2 text-sm text-gray-500">
              <span>{warehouse.size} sq ft</span>
              <span>•</span>
              <p
                className={`font-medium ${
                  warehouse.availability === "available" &&
                  warehouse.isStandBy === false
                    ? "text-green-600"
                    : warehouse.availability === "booked"
                    ? "text-red-600"
                    : warehouse.availability === "maintenance"
                    ? "text-yellow-600"
                    : "text-orange-600"
                }`}
              >
                {warehouse.availability === "available" &&
                warehouse.isStandBy === false
                  ? "Available"
                  : warehouse.availability === "booked"
                  ? "Sold Out"
                  : warehouse.availability === "maintenance"
                  ? "Under Maintenance"
                  : "Awaiting Payment"}
              </p>
            </div>
          </div>
          {/* Dropdown Menu */}
          {warehouse.ownerId._id === user && (
            <div
              className="absolute top-2 right-2 transition-opacity z-[40]"
              onMouseEnter={() => setShowDropdown(true)}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDropdown(!showDropdown);
                }}
                className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <MoreVertical className="w-5 h-5 text-gray-600" />
              </button>
              {showDropdown && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-[50]"
                  onMouseEnter={() => setShowDropdown(true)}
                  onMouseLeave={() => setShowDropdown(false)}
                >
                  <div className="py-1">
                    <button
                      onClick={handleEdit}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit this listing
                    </button>
                    <button
                      onClick={handleDeleteClick}
                      disabled={warehouse.availability !== "available"}
                      title={
                        warehouse.availability !== "available"
                          ? "Can not delete currently booked warehouse"
                          : ""
                      }
                      className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left cursor-not-allowed
                        ${
                          warehouse.availability !== "available"
                            ? "opacity-50"
                            : ""
                        }
                        `}
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete this listing
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        warehouseName={warehouse.name}
      />
    </>
  );
};

export default StorageCard;
