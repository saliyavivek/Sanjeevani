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
  <div
    onClick={() => navigate(`/booking/${booking._id}`)}
    className="flex flex-col bg-white overflow-hidden cursor-pointer group"
  >
    {/* Image Container */}
    <div className="p-1 lg:p-3">
      <div className="relative aspect-[1/1] overflow-hidden border-[6px] border-white rounded-xl shadow-[0_4px_12px_rgba(0,0,0,0.1)]">
        <img
          src={
            booking.warehouseId.images[0] ||
            "/placeholder.svg?height=400&width=400"
          }
          alt={booking.warehouseId.name}
          className="w-full h-full object-cover transition-transform duration-300 rounded-xl"
        />
        <div className="absolute top-4 right-4">
          <StatusBadge status={booking.status} />
        </div>
      </div>
    </div>

    {/* Content */}
    <div className="px-2 lg:px-4 py-3 flex flex-col flex-1">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-medium text-gray-900">
          {booking.warehouseId.name}
        </h3>
        <span className="text-lg font-medium">
          ₹{booking.totalPrice.toLocaleString()}
        </span>
      </div>

      <div className="space-y-2 text-gray-500 flex-1">
        <p className="flex items-center text-sm">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span className="line-clamp-1">
            {booking.warehouseId.location.formattedAddress}
          </span>
        </p>

        <div className="flex items-center text-sm">
          <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>
            {format(new Date(booking.startDate), "MMM d")} -{" "}
            {format(new Date(booking.endDate), "MMM d, yyyy")}
          </span>
        </div>

        <div className="flex items-center text-sm">
          <Package className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{booking.warehouseId.size} sq ft.</span>
        </div>
      </div>

      {/* <div className="mt-4 flex items-center text-gray-900 text-sm font-medium group-hover:underline">
        View details
        <ChevronRight className="w-4 h-4 ml-1" />
      </div> */}
    </div>
  </div>
);

const MyBookings = () => {
  const token = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("current");
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchBookings = async () => {
    if (token) {
      const { userId } = jwtDecode(token);
      const response = await fetch(`${API_BASE_URL}/bookings/getall`, {
        method: "POST",
        body: JSON.stringify({ userId }),
        headers: {
          "Content-Type": "application/json",
        },
      });
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
