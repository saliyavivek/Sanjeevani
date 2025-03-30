import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import StorageCard from "../components/StorageCard";
import useAuth from "../hooks/useAuth";
import { ArrowLeft, PlusCircle, Search } from "lucide-react";
import StorageCardSkeleton from "../components/StorageCardSkeleton";
import { useNavigate } from "react-router-dom";

export default function Listings() {
  useAuth();

  const [warehouses, setWarehouses] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

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
    const response = await fetch(`${API_BASE_URL}/warehouses/listings`, {
      method: "POST",
      body: JSON.stringify({
        user,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      // console.log(data);
      setWarehouses(data.warehouses);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchStorages();
  }, [user]);

  const [searchTerm, setSearchTerm] = useState("");

  const filteredWarehouses = warehouses.filter((warehouse) =>
    warehouse.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-1 md:gap-2">
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
            {/* <button className="bg-emerald-600 text-white px-2 md:px-3 py-2 mb-6 text-sm rounded-lg flex items-center hover:bg-emerald-700 transition-colors duration-200">
              <PlusCircle className="w-5 h-5 mr-2" />
              Add New Listing
            </button> */}
            <button
              className={`
        group relative overflow-hidden bg-gradient-to-r from-emerald-500 to-emerald-600 
        hover:from-emerald-600 hover:to-emerald-700 text-white font-medium
        px-2 md:px-6 py-2.5 rounded-md shadow-sm 
        inline-flex items-center justify-center
        transition-all duration-300 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2
        active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
      `}
            >
              <span className="absolute inset-0 w-full h-full bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span>
              <PlusCircle className="w-4 h-4 mr-2 transition-transform group-hover:rotate-90 duration-300" />
              <span className="text-sm md:text-md">Add New Listing</span>
            </button>
          </a>
        </div>
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search listings..."
              className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none hover:bg-gray-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search
              className="absolute right-3 top-2 text-gray-400"
              size={20}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {loading ? (
            // Show skeletons based on the number of warehouses
            Array.from({ length: 4 }).map(
              (
                _,
                index // Adjust the length as needed
              ) => <StorageCardSkeleton key={index} />
            )
          ) : filteredWarehouses.length > 0 ? (
            filteredWarehouses.map((warehouse) => (
              <StorageCard
                key={warehouse._id}
                warehouse={warehouse}
                onDelete={fetchStorages}
              />
            ))
          ) : (
            <p className="text-gray-600">No such listing.</p>
          )}
        </div>
      </div>
    </div>
  );
}
