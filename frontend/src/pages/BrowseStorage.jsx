import React, { useEffect, useState } from "react";
import StorageCard from "../components/StorageCard";
import useAuth from "../hooks/useAuth";

export default function BrowseStorage() {
  useAuth();
  const [warehouses, setWarehouses] = useState([]);

  const fetchStorages = async () => {
    const response = await fetch("http://localhost:8080/api/warehouses/");
    if (response.ok) {
      const data = await response.json();
      setWarehouses(data.warehouses);
    }
  };

  useEffect(() => {
    fetchStorages();
  }, []);

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Available Storage Spaces
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {warehouses.map((warehouse) => (
            <>
              <StorageCard key={warehouse._id} warehouse={warehouse} />
            </>
          ))}
        </div>
      </div>
    </div>
  );
}
