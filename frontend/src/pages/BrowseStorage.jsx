"use client";

import { useEffect, useState } from "react";
import StorageCard from "../components/StorageCard";
import StorageCardSkeleton from "../components/StorageCardSkeleton";
import useAuth from "../hooks/useAuth";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  TrendingUp,
  ChevronRight,
} from "lucide-react";
import FilterModal from "../components/FilterModal";
import { useNavigate } from "react-router-dom";

export default function BrowseStorage() {
  useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [recommendedWarehouses, setRecommendedWarehouses] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRecommendationsLoading, setIsRecommendationsLoading] =
    useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const fetchStorages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/warehouses/`);
      if (response.ok) {
        const data = await response.json();
        // console.log(data);

        setWarehouses(shuffleArray(data.warehouses));
        setFilteredWarehouses(shuffleArray(data.warehouses));
      }
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRecommendedWarehouses = async () => {
    setIsRecommendationsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/warehouses/`);
      if (response.ok) {
        const data = await response.json();
        const sortedByBookings = [...data.warehouses].sort((a, b) => {
          const aBookings = a.bookings ? a.bookings.length : 0;
          const bBookings = b.bookings ? b.bookings.length : 0;
          return bBookings - aBookings;
        });

        setRecommendedWarehouses(sortedByBookings.slice(0, 10));
      }
    } catch (error) {
      console.error("Error fetching recommended warehouses:", error);
    } finally {
      setIsRecommendationsLoading(false);
    }
  };

  useEffect(() => {
    fetchStorages();
    fetchRecommendedWarehouses();
  }, []);

  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleApplyFilters = (filters) => {
    console.log("Applied filters:", filters);
    const filtered = warehouses.filter((warehouse) => {
      const withinPriceRange =
        filters.priceRange.min === 0 ||
        filters.priceRange.max === 0 ||
        (warehouse.pricePerDay >= filters.priceRange.min &&
          warehouse.pricePerDay <= filters.priceRange.max);
      const withinSizeRange =
        filters.sizeRange.min === 0 ||
        filters.sizeRange.max === 0 ||
        (warehouse.size >= filters.sizeRange.min &&
          warehouse.size <= filters.sizeRange.max);
      const availabilityMatch =
        filters.availability === "all" ||
        warehouse.availability === filters.availability;

      return withinPriceRange && withinSizeRange && availabilityMatch;
    });
    setFilteredWarehouses(filtered);
  };

  // Function to check if a warehouse is in the recommended list
  const isRecommended = (warehouseId) => {
    return recommendedWarehouses.some(
      (warehouse) => warehouse._id === warehouseId
    );
  };

  // Generate skeleton array based on grid layout
  const skeletons = Array(8).fill(null);
  const recommendationSkeletons = Array(4).fill(null);

  const displayedWarehouses = filteredWarehouses.filter(
    (warehouse) =>
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.ownerId.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex flex-column justify-start items-start mb-6">
          <div className="flex items-center gap-2 md:gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-50 transition-colors duration-200"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 md:text-3xl">
              Explore Storages
            </h1>
          </div>
          <div className="w-full flex flex-col items-end md:flex-row md:items-center gap-2 mb-2">
            <div className="relative w-[100%] md:w-[95%]">
              <input
                type="text"
                placeholder="Search warehouses or owners..."
                className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-green-500 hover:bg-gray-50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search
                className="absolute right-3 top-2 text-gray-400"
                size={20}
              />
            </div>
            <div>
              <button
                className="flex justify-center items-center gap-2 hover:bg-gray-100 rounded-md h-10 px-1 md:px-5 py-2"
                onClick={() => setIsFilterModalOpen(true)}
              >
                <SlidersHorizontal className="w-5 h-5" />
                Filters
              </button>
            </div>
          </div>
          {/* Recommendations Section */}
          {/* <div className="mb-12 mt-12">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <TrendingUp className="h-5 w-5 text-green-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Recommendations for You
                </h2>
              </div>
              <button
                onClick={() => navigate("/recommendations")}
                className="text-green-600 hover:text-green-700 text-sm font-medium flex items-center"
              >
                View all
                <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-6 mb-6">
              <p className="text-gray-600 mb-4">
                Based on popular choices among farmers in your area
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {isRecommendationsLoading ? (
                  recommendationSkeletons.map((_, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg shadow-sm p-4 h-48"
                    >
                      <div className="animate-pulse flex flex-col h-full">
                        <div className="rounded-lg bg-gray-200 h-24 w-full mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                        <div className="mt-auto">
                          <div className="h-4 bg-gray-200 rounded w-1/4 mt-2"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : recommendedWarehouses.length > 0 ? (
                  recommendedWarehouses
                    .slice(0, 4)
                    .map((warehouse) => (
                      <StorageCard
                        key={warehouse._id}
                        warehouse={warehouse}
                        isFavorite={true}
                      />
                    ))
                ) : (
                  <p className="col-span-4 text-center text-gray-500">
                    No recommendations available.
                  </p>
                )}
              </div>
            </div>
          </div> */}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading ? (
            skeletons.map((_, index) => <StorageCardSkeleton key={index} />)
          ) : displayedWarehouses.length > 0 ? (
            displayedWarehouses.map((warehouse) => (
              <StorageCard
                key={warehouse._id}
                warehouse={warehouse}
                isFavorite={isRecommended(warehouse._id)}
              />
            ))
          ) : (
            <p className="text-gray-500">No warehouses found.</p>
          )}
        </div>
      </div>
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApplyFilters={handleApplyFilters}
      />
    </div>
  );
}
