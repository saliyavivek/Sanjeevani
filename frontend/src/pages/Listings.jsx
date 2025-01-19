import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import StorageCard from "../components/StorageCard";
import useAuth from "../hooks/useAuth";
import { ArrowLeft, PlusCircle } from "lucide-react";
import StorageCardSkeleton from "../components/StorageCardSkeleton";
import { useNavigate } from "react-router-dom";

export default function Listings() {
  useAuth();

  const [warehouses, setWarehouses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStorages = async () => {
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
    const response = await fetch(
      "http://localhost:8080/api/warehouses/listings",
      {
        method: "POST",
        body: JSON.stringify({
          user,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    if (response.ok) {
      const data = await response.json();
      setWarehouses(data.warehouses);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStorages();
  }, [user]);

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-1 md:gap-2 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="pl-1 md:p-2 rounded-full hover:bg-gray-50 transition-colors duration-200"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
              Your listings
            </h1>
          </div>
          <a href="/warehouse/list">
            <button className="bg-emerald-600 text-white px-2 md:px-3 py-2 mb-6 text-sm rounded-lg flex items-center hover:bg-emerald-700 transition-colors duration-200">
              <PlusCircle className="w-5 h-5 mr-2" />
              Add New Listing
            </button>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading
            ? // Show skeletons based on the number of warehouses
              Array.from({ length: 4 }).map(
                (
                  _,
                  index // Adjust the length as needed
                ) => <StorageCardSkeleton key={index} />
              )
            : warehouses.map((warehouse) => (
                <StorageCard
                  key={warehouse._id}
                  warehouse={warehouse}
                  onDelete={fetchStorages}
                />
              ))}
        </div>
      </div>
    </div>
  );
}
