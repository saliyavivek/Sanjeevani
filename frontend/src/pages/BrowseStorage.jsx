import React, { useEffect, useState } from "react";
import StorageCard from "../components/StorageCard";
import useAuth from "../hooks/useAuth";
import { SlidersHorizontal } from "lucide-react";
import FilterModal from "../components/FilterModal";

export default function BrowseStorage() {
  useAuth();
  const [warehouses, setWarehouses] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [filteredWarehouses, setFilteredWarehouses] = useState([]);

  const fetchStorages = async () => {
    const response = await fetch("http://localhost:8080/api/warehouses/");
    if (response.ok) {
      const data = await response.json();
      setWarehouses(data.warehouses);
      setFilteredWarehouses(data.warehouses);
    }
  };

  useEffect(() => {
    fetchStorages();
  }, []);

  const handleApplyFilters = (filters) => {
    console.log("Applied filters:", filters);
    // Filter warehouses based on the applied filters
    const filtered = warehouses.filter((warehouse) => {
      const withinPriceRange =
        warehouse.pricePerMonth >= filters.priceRange.min &&
        warehouse.pricePerMonth <= filters.priceRange.max;
      const withinSizeRange =
        warehouse.size >= filters.sizeRange.min &&
        warehouse.size <= filters.sizeRange.max;
      const availabilityMatch =
        filters.availability === "all" ||
        (filters.availability === "available" && warehouse.available);

      return withinPriceRange && withinSizeRange && availabilityMatch;
    });
    setFilteredWarehouses(filtered); // Update the filtered warehouses state
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Available Storage Spaces
          </h1>
          <div>
            <button
              className="flex justify-center items-center mb-8 gap-2 hover:bg-gray-100 rounded-md h-10 px-3 py-2"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredWarehouses.map(
            (
              warehouse // Use filtered warehouses for display
            ) => (
              <StorageCard key={warehouse._id} warehouse={warehouse} />
            )
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
