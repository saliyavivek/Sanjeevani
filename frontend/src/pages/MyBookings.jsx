import React, { useEffect, useState } from "react";
import { format, isFuture, isPast, isToday } from "date-fns";
import {
  MapPin,
  Calendar,
  Package,
  ChevronRight,
  Clock,
  ArrowLeft,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import StorageCardSkeleton from "../components/StorageCardSkeleton";

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
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
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
      {/* <a href={`/warehouse/${booking.warehouseId._id}`}> */}
      <h3 className="text-xl font-semibold text-gray-900 mb-2">
        {booking.warehouseId.name}
      </h3>
      {/* </a> */}
      <p className="text-gray-500 flex items-center mb-4">
        <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
        <span className="truncate">
          {booking.warehouseId.location.formattedAddress}
        </span>
      </p>
      <div className="flex items-center text-gray-600 mb-2">
        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
        <span className="text-sm">
          {format(new Date(booking.startDate), "MMM d, yyyy")} -{" "}
          {format(new Date(booking.endDate), "MMM d, yyyy")}
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
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("current");

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
        // console.log(data);

        setBookings(data);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  const normalizeDate = (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    return normalizedDate;
  };

  const categorizeBookings = () => {
    const today = normalizeDate(new Date());
    return {
      past: bookings.filter(
        (booking) => normalizeDate(booking.endDate) < today
      ),
      current: bookings.filter(
        (booking) =>
          normalizeDate(booking.startDate) <= today &&
          normalizeDate(booking.endDate) >= today
      ),
      upcoming: bookings.filter(
        (booking) => normalizeDate(booking.startDate) > today
      ),
    };
  };

  const categorizedBookings = categorizeBookings();

  const TabButton = ({ label, count, isActive, onClick }) => (
    <button
      className={`px-4 py-2 font-medium text-sm rounded-md transition-colors ${
        isActive
          ? "bg-emerald-100 text-emerald-800"
          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100"
      }`}
      onClick={onClick}
    >
      {label} ({count})
    </button>
  );

  return (
    <div className="min-h-screen bg-white-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-50 transition-colors duration-200"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-3xl font-semibold text-gray-900">My Bookings</h1>
        </div>
        <div className="flex space-x-4 mb-8">
          <TabButton
            label="Current"
            count={categorizedBookings.current.length}
            isActive={activeTab === "current"}
            onClick={() => setActiveTab("current")}
          />
          <TabButton
            label="Upcoming"
            count={categorizedBookings.upcoming.length}
            isActive={activeTab === "upcoming"}
            onClick={() => setActiveTab("upcoming")}
          />
          <TabButton
            label="Past"
            count={categorizedBookings.past.length}
            isActive={activeTab === "past"}
            onClick={() => setActiveTab("past")}
          />
        </div>
        {loading ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <StorageCardSkeleton key={index} />
            ))}
          </div>
        ) : (
          <>
            {categorizedBookings[activeTab].length === 0 ? (
              <div className="text-center py-12">
                <Clock className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No bookings
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  You don't have any {activeTab} bookings at the moment.
                </p>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categorizedBookings[activeTab].map((booking) => (
                  <BookingCard
                    key={booking._id}
                    booking={booking}
                    navigate={navigate}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default MyBookings;
