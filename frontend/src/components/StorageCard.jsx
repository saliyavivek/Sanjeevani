import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical, Edit, Trash2 } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import DeleteConfirmModal from "./DeleteConfirmModal";
import { showLoadingToast, showSuccessToast } from "./toast";

const StorageCard = ({ warehouse, onDelete }) => {
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [user, setUser] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
      const response = await fetch(
        "http://localhost:8080/api/warehouses/delete",
        {
          method: "DELETE",
          body: JSON.stringify({ warehouseId: warehouse._id }),
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.ok) {
        const data = await response.json();
        showSuccessToast(data.message, loadingToastId);
        // console.log(data.message);
        onDelete();
        // navigate("/listings");
      } else {
        const errorData = await response.json();
        showSuccessToast(errorData.message, loadingToastId);
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

  return (
    <>
      <div
        className="group relative flex flex-col cursor-pointer"
        onClick={handleClick}
        onMouseLeave={() => setShowDropdown(false)}
      >
        <div className="relative w-full overflow-hidden rounded-lg">
          <img
            src={warehouse.images[0] || "/placeholder.svg?height=300&width=400"}
            alt={warehouse.name}
            className="object-cover transition-transform group-hover:scale-105 h-80 w-full"
          />
        </div>
        <h3 className="mt-2 text-lg font-semibold text-gray-900">
          {warehouse.name}
        </h3>
        <p className="text-md text-black-600">
          {/* Listed by{" "}
          {warehouse.ownerId._id === user ? "you" : warehouse.ownerId.name} */}
          <span className="font-medium">₹{warehouse.pricePerDay}</span> day
        </p>
        <p
          className={`mt-1 text-sm ${
            warehouse.availability === "available"
              ? "text-green-600"
              : warehouse.availability === "booked"
              ? "text-red-600"
              : "text-yellow-600"
          }`}
        >
          {warehouse.availability === "available"
            ? "Available"
            : warehouse.availability === "booked"
            ? "Sold Out"
            : "Under Maintenance"}
        </p>

        {/* 3-dot menu */}
        {warehouse.ownerId._id === user && (
          <div
            className="absolute top-2 right-2 transition-opacity"
            onMouseEnter={() => setShowDropdown(true)}
          >
            <button
              onClick={(e) => e.stopPropagation()}
              className="p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
            >
              <MoreVertical className="w-5 h-5 text-gray-600" />
            </button>

            {/* Dropdown menu */}
            {showDropdown && (
              <div
                className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10"
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
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
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
