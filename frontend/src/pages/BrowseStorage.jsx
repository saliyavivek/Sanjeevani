import React, { useEffect, useState } from "react";
import StorageCard from "../components/StorageCard";
import StorageCardSkeleton from "../components/StorageCardSkeleton";
import useAuth from "../hooks/useAuth";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import FilterModal from "../components/FilterModal";
import { useNavigate } from "react-router-dom";

export default function BrowseStorage() {
  useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStorages = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/warehouses/");
      if (response.ok) {
        const data = await response.json();
        setWarehouses(data.warehouses);
        setFilteredWarehouses(data.warehouses);
      }
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStorages();
  }, []);

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

  // Generate skeleton array based on grid layout
  const skeletons = Array(8).fill(null);

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2 md:gap-4 mb-8">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full hover:bg-gray-50 transition-colors duration-200"
              aria-label="Go back"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900 md:text-3xl">
              Available Storage Spaces
            </h1>
          </div>
          <div>
            <button
              className="flex justify-center items-center mb-8 gap-2 hover:bg-gray-100 rounded-md h-10 px-1 md:px-5 py-2"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {isLoading
            ? skeletons.map((_, index) => <StorageCardSkeleton key={index} />)
            : filteredWarehouses.map((warehouse) => (
                <StorageCard key={warehouse._id} warehouse={warehouse} />
              ))}
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
