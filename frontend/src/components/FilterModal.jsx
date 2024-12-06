import React, { useState } from "react";
import { X, SlidersHorizontal } from "lucide-react";

const FilterModal = ({ isOpen, onClose, onApplyFilters }) => {
  const [filters, setFilters] = useState({
    priceRange: {
      min: 1000,
      max: 50000,
    },
    sizeRange: {
      min: 100,
      max: 5000,
    },
    availability: "all",
  });

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [name]: parseInt(value) || 0,
      },
    }));
  };

  const handleSizeChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      sizeRange: {
        ...prev.sizeRange,
        [name]: parseInt(value) || 0,
      },
    }));
  };

  const handleClearAll = () => {
    setFilters({
      priceRange: {
        min: 1000,
        max: 50000,
      },
      sizeRange: {
        min: 100,
        max: 5000,
      },
      availability: "all",
      sortBy: "recommended",
    });
  };

  const handleApply = () => {
    onApplyFilters(filters); // Pass the filters back to BrowseStorage
    onClose(); // Close the modal after applying filters
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-semibold">Filters</h2>
          <div className="w-5"></div> {/* Spacer for alignment */}
        </div>

        {/* Filter Content */}
        <div className="p-6 space-y-8">
          {/* Price Range */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Price range</h3>
            <p className="text-sm text-gray-600 mb-3">Monthly price in ₹</p>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="text-sm text-gray-600">Minimum</label>
                  <div className="mt-1 relative">
                    <input
                      type="number"
                      name="min"
                      value={filters.priceRange.min}
                      onChange={handlePriceChange}
                      className="pl-7 w-full border rounded-lg p-2"
                      placeholder="₹1000"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-600">Maximum</label>
                  <div className="mt-1 relative">
                    <input
                      type="number"
                      name="max"
                      value={filters.priceRange.max}
                      onChange={handlePriceChange}
                      className="pl-7 w-full border rounded-lg p-2"
                      placeholder="50000"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Size Range */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Size range</h3>
            <p className="text-sm text-gray-600 mb-4">Storage space in sq ft</p>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-sm text-gray-600">Minimum</label>
                <input
                  type="number"
                  name="min"
                  value={filters.sizeRange.min}
                  onChange={handleSizeChange}
                  className="w-full border rounded-lg p-2 mt-1"
                  placeholder="100"
                />
              </div>
              <div className="flex-1">
                <label className="text-sm text-gray-600">Maximum</label>
                <input
                  type="number"
                  name="max"
                  value={filters.sizeRange.max}
                  onChange={handleSizeChange}
                  className="w-full border rounded-lg p-2 mt-1"
                  placeholder="5000"
                />
              </div>
            </div>
          </div>

          {/* Availability */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Availability</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                className={`p-4 border rounded-lg text-center ${
                  filters.availability === "available"
                    ? "border-black bg-gray-50"
                    : "hover:border-black"
                }`}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, availability: "available" }))
                }
              >
                Available
              </button>
              <button
                className={`p-4 border rounded-lg text-center ${
                  filters.availability === "all"
                    ? "border-black bg-gray-50"
                    : "hover:border-black"
                }`}
                onClick={() =>
                  setFilters((prev) => ({ ...prev, availability: "all" }))
                }
              >
                Show All
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t">
          <button
            onClick={handleClearAll}
            className="text-sm font-semibold underline"
          >
            Clear all
          </button>
          <button
            onClick={() => {
              handleApply();
              onClose();
            }}
            className="bg-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-800"
          >
            Show places
          </button>
        </div>
      </div>
    </div>
  );
};

export default FilterModal;
