import React, { useState } from "react";
import { Calendar, MapPin, User, Check, X, Filter } from "lucide-react";

const BookingRequests = () => {
  const [filter, setFilter] = useState("all");

  // Mock data for booking requests
  const [requests, setRequests] = useState([
    {
      id: 1,
      status: "pending",
      farmer: "John Doe",
      warehouse: "Green Valley Storage",
      location: "Sacramento, CA",
      startDate: "2023-06-15",
      endDate: "2023-07-15",
      crop: "Wheat",
      quantity: "500 tons",
    },
    {
      id: 2,
      status: "approved",
      farmer: "Jane Smith",
      warehouse: "Sunrise Warehouse",
      location: "Fresno, CA",
      startDate: "2023-07-01",
      endDate: "2023-08-31",
      crop: "Corn",
      quantity: "750 tons",
    },
    {
      id: 3,
      status: "declined",
      farmer: "Bob Johnson",
      warehouse: "Central Valley Storage",
      location: "Modesto, CA",
      startDate: "2023-06-20",
      endDate: "2023-09-20",
      crop: "Soybeans",
      quantity: "600 tons",
    },
    {
      id: 4,
      status: "pending",
      farmer: "Alice Brown",
      warehouse: "Golden State Warehouse",
      location: "Bakersfield, CA",
      startDate: "2023-08-01",
      endDate: "2023-10-31",
      crop: "Rice",
      quantity: "1000 tons",
    },
  ]);

  const handleApprove = (id) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: "approved" } : req
      )
    );
  };

  const handleDecline = (id) => {
    setRequests(
      requests.map((req) =>
        req.id === id ? { ...req, status: "declined" } : req
      )
    );
  };

  const filteredRequests = requests.filter(
    (req) => filter === "all" || req.status === filter
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Booking Requests
      </h1>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          <Filter className="text-gray-500" />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            <option value="all">All Requests</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="declined">Declined</option>
          </select>
        </div>
        <p className="text-sm text-gray-500">
          {filteredRequests.length} requests
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {request.warehouse}
                </h2>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    request.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : request.status === "declined"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {request.status.charAt(0).toUpperCase() +
                    request.status.slice(1)}
                </span>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600 flex items-center">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  {request.farmer}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  {request.location}
                </p>
                <p className="text-sm text-gray-600 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {request.startDate} to {request.endDate}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Crop:</span> {request.crop}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Quantity:</span>{" "}
                  {request.quantity}
                </p>
              </div>
            </div>
            {request.status === "pending" && (
              <div className="flex border-t border-gray-200">
                <button
                  onClick={() => handleApprove(request.id)}
                  className="flex-1 px-4 py-2 bg-emerald-500 text-white font-medium hover:bg-emerald-600 transition-colors duration-200 flex items-center justify-center"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Approve
                </button>
                <button
                  onClick={() => handleDecline(request.id)}
                  className="flex-1 px-4 py-2 bg-red-500 text-white font-medium hover:bg-red-600 transition-colors duration-200 flex items-center justify-center"
                >
                  <X className="w-4 h-4 mr-2" />
                  Decline
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingRequests;
