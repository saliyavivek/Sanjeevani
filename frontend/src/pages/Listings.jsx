import React, { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import StorageCard from "../components/StorageCard";
import useAuth from "../hooks/useAuth";
import { PlusCircle } from "lucide-react";

export default function Listings() {
  useAuth();

  const [warehouses, setWarehouses] = useState([]);
  const [user, setUser] = useState(null);

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
  };

  useEffect(() => {
    fetchStorages();
  }, [user]);

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Your listings</h1>
          <a href="/warehouse/list">
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-green-700 transition-colors duration-200">
              <PlusCircle className="w-5 h-5 mr-2" />
              Add New Listing
            </button>
          </a>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {warehouses.map((warehouse) => (
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
