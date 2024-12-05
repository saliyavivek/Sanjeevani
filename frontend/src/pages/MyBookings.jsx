import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { MapPin, Calendar, Package, ChevronRight } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

// const bookings = [
//   {
//     id: 1,
//     warehouseName: "Modern Storage Facility",
//     location: "123 Storage Lane, Mumbai, Maharashtra 400001",
//     startDate: new Date(2024, 0, 15),
//     endDate: new Date(2024, 1, 15),
//     status: "active",
//     size: "500 sq ft",
//     price: 25000,
//     image: "/placeholder.svg?height=200&width=300",
//   },
//   {
//     id: 2,
//     warehouseName: "Secure Warehouse Solutions",
//     location: "456 Safekeep Road, Delhi, 110001",
//     startDate: new Date(2024, 2, 1),
//     endDate: new Date(2024, 3, 30),
//     status: "upcoming",
//     size: "1000 sq ft",
//     price: 45000,
//     image: "/placeholder.svg?height=200&width=300",
//   },
//   {
//     id: 3,
//     warehouseName: "City Center Storage",
//     location: "789 Urban Avenue, Bangalore, 560001",
//     startDate: new Date(2023, 11, 1),
//     endDate: new Date(2023, 11, 31),
//     status: "completed",
//     size: "250 sq ft",
//     price: 15000,
//     image: "/placeholder.svg?height=200&width=300",
//   },
// ];

const StatusBadge = ({ status }) => {
  const statusStyles = {
    active: "bg-green-100 text-green-800",
    upcoming: "bg-blue-100 text-blue-800",
    completed: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
  };

  return (
    <span
      className={`px-2 py-1 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const BookingCard = ({ booking, navigate }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md hover:scale-[1.02]">
    <div className="relative h-48 overflow-hidden">
      <img
        src={booking.warehouseId.images[0]}
        alt={booking.warehouseId.name}
        className="w-full h-full object-cover transition-transform hover:scale-110 duration-300"
      />
      <div className="absolute top-4 right-4">
        <StatusBadge status={booking.status} />
      </div>
    </div>
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {booking.warehouseId.name}
      </h3>
      <p className="text-gray-500 flex items-center mb-4">
        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
        <span className="truncate">
          {booking.warehouseId.location.formattedAddress}
        </span>
      </p>
      <div className="flex items-center text-gray-600 mb-2">
        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
        <span className="text-sm">
          {format(booking.startDate, "MMM d, yyyy")} -{" "}
          {format(booking.endDate, "MMM d, yyyy")}
        </span>
      </div>
      <div className="flex items-center text-gray-600 mb-4">
        <Package className="w-4 h-4 mr-2 flex-shrink-0" />
        <span className="text-sm">{booking.warehouseId.size} sq ft.</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-2xl font-bold text-gray-900">
          ₹{booking.totalPrice.toLocaleString()}
        </span>

        <button
          onClick={() => navigate(`/booking/${booking._id}`)}
          className="text-emerald-600 hover:text-emerald-700 font-medium flex items-center transition-colors"
        >
          View Details
          <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  </div>
);

const MyBookings = () => {
  const token = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    if (token) {
      const { userId } = jwtDecode(token);
      const response = await fetch(
        "http://localhost:8080/api/bookings/getall",
        {
          method: "POST",
          body: JSON.stringify({ userId }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        console.log(data);

        setBookings(data);
      }
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {bookings.map((booking) => (
            <BookingCard
              key={booking._id}
              booking={booking}
              navigate={navigate}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
