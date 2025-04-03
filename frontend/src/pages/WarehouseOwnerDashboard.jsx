import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Package,
  Calendar,
  MessageSquare,
  Settings,
  PlusCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const WarehouseOwnerDashboard = () => {
  const token = useAuth();
  const [name, setName] = useState("");
  const [userId, setUserId] = useState(null);
  const [info, setInfo] = useState([]);
  const [totListings, setTotListings] = useState(0);
  // const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setName(decodedToken.name);
      setUserId(decodedToken.userId);
    }
  }, [token]);

  useEffect(() => {
    fetchOwnerInfo();
  }, [userId]);

  const fetchOwnerInfo = async () => {
    try {
      if (userId) {
        const response = await fetch(`${API_BASE_URL}/bookings/customers`, {
          method: "POST",
          body: JSON.stringify({ userId }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          console.log("Error while fetching user bookings.");
          return;
        }
        const data = await response.json();
        setInfo(data.bookings);
        setTotListings(data.totalListings);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const formatDate = (dateString) => {
  //   const options = { year: "numeric", month: "short", day: "numeric" };
  //   return new Date(dateString).toLocaleDateString(undefined, options);
  // };

  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case "active":
  //       return "bg-green-100 text-green-800";
  //     case "upcoming":
  //       return "bg-blue-100 text-blue-800";
  //     case "completed":
  //       return "bg-gray-100 text-gray-800";
  //     case "pending":
  //       return "bg-yellow-100 text-yellow-800";
  //     case "declined":
  //       return "bg-red-100 text-red-800";
  //     default:
  //       return "bg-gray-100 text-gray-800";
  //   }
  // };

  const normalizeDate = (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    return normalizedDate;
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const categorizeBookings = () => {
    const today = normalizeDate(new Date());
    return {
      past: info.filter(
        (booking) =>
          normalizeDate(booking.endDate) < today &&
          booking.approvalStatus == "approved"
      ),
      current: info.filter(
        (booking) =>
          normalizeDate(booking.startDate) <= today &&
          normalizeDate(booking.endDate) >= today &&
          booking.approvalStatus == "approved" &&
          booking.warehouseId.isStandBy != true
      ),
      upcoming: info.filter(
        (booking) =>
          normalizeDate(booking.startDate) > today &&
          booking.approvalStatus == "approved" &&
          booking.warehouseId.isStandBy != true
      ),
      declined: info.filter(
        (booking) =>
          booking.approvalStatus == "rejected" && booking.status == "declined"
      ),
      pending: info.filter(
        (booking) =>
          booking.approvalStatus == "pending" &&
          booking.status == "pending" &&
          booking.warehouseId.isStandBy != true
      ),
      awaiting: info.filter(
        (booking) =>
          booking.warehouseId.isStandBy == true &&
          booking.status == "pending" &&
          booking.approvalStatus == "approved"
      ),
    };
  };

  const { past, current, upcoming, declined, pending, awaiting } =
    categorizeBookings();

  // const toggleSidebar = () => {
  //   setIsSidebarOpen(!isSidebarOpen);
  // };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Mobile Header */}
      {/* <header className="lg:hidden bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">FarmStore</h1>
        <button onClick={toggleSidebar} className="text-gray-600">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header> */}

      {/* Sidebar */}
      {/* <aside
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } lg:block w-full lg:w-64 bg-white shadow-md`}
      >
        <nav className="mt-6">
          <a
            href="/owner/dashboard"
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 border-r-4 border-blue-600"
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Dashboard
          </a>
          <a
            href="/listings"
            className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
          >
            <Package className="w-5 h-5 mr-3" />
            My Listings
          </a>
          <a
            href="/settings"
            className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </a>
        </nav>
      </aside> */}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-2">
            Welcome back, {name ? name : "John"}!
          </h2>
          <a href="/warehouse/list">
            <button
              className={`
                    group relative overflow-hidden bg-gradient-to-r from-blue-500 to-blue-600 
                    hover:from-blue-600 hover:to-blue-700 text-white font-medium
                    px-6 py-2.5 rounded-md shadow-sm 
                    inline-flex items-center justify-center
                    transition-all duration-300 ease-in-out
                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed
                  `}
            >
              <span className="absolute inset-0 w-full h-full bg-white/10 scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></span>
              <PlusCircle className="w-4 h-4 mr-2 transition-transform group-hover:rotate-90 duration-300" />
              <span>Add New Listing</span>
            </button>
          </a>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-700 mb-2">
              Total Listings
            </h3>
            <p className="text-2xl lg:text-3xl font-bold text-blue-600">
              {info && totListings}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-700 mb-2">
              Active Bookings
            </h3>
            <p className="text-2xl lg:text-3xl font-bold text-blue-600">
              {
                info.filter(
                  (booking) =>
                    booking.approvalStatus == "approved" &&
                    booking.status == "active"
                ).length
              }
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-700 mb-2">
              Total Space
            </h3>
            <p className="text-2xl lg:text-3xl font-bold text-blue-600">
              {info
                .filter(
                  (booking) =>
                    booking.approvalStatus == "approved" &&
                    booking.status != "pending"
                )
                .reduce((acc, curr) => acc + Number(curr.warehouseId.size), 0)
                .toLocaleString()}{" "}
              sq ft.
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-700 mb-2">
              Total Revenue
            </h3>
            <p className="text-2xl lg:text-3xl font-bold text-green-600">
              ₹
              {/* {info
                .filter((listing) => listing.availability === "booked")
                .reduce((acc, curr) => {
                  const bookings = Array.isArray(curr.bookings)
                    ? curr.bookings
                    : [curr.bookings];

                  const revenueForListing = bookings.reduce(
                    (bookingAcc, booking) => {
                      const startDate = new Date(booking.startDate);
                      const endDate = new Date(booking.endDate);
                      const difference = Math.abs(endDate - startDate);
                      const days = difference / (1000 * 3600 * 24) + 1;
                      const pricePerDay = parseFloat(curr.pricePerDay) || 0;
                      return bookingAcc + days * pricePerDay;
                    },
                    0
                  );

                  return acc + revenueForListing;
                }, 0)
                .toLocaleString()} */}
              {/* {info
                .reduce((acc, warehouse) => {
                  const warehouseEarnings = warehouse.bookings.reduce(
                    (sum, booking) => {
                      return sum + (booking.ownerEarnings || 0);
                    },
                    0
                  );
                  return acc + warehouseEarnings;
                }, 0)
                .toLocaleString()} */}
              {info
                ?.filter(
                  (booking) =>
                    booking.approvalStatus == "approved" &&
                    booking.status != "pending"
                )
                .reduce(
                  (acc, curr) => acc + (Number(curr.ownerEarnings) || 0),
                  0
                )
                .toLocaleString()}
            </p>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow overflow-x-auto mb-8">
          <div className="p-4 lg:p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Recent Bookings
            </h3>
            <table className="w-full min-w-max">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3 md:pr-4">Warehouse</th>
                  <th className="pb-3 md:pr-4">Booked by</th>
                  <th className="pb-3 md:pr-4 hidden md:table-cell">Space</th>
                  <th className="pb-3 md:pr-4 hidden md:table-cell">From</th>
                  <th className="pb-3 md:pr-4 hidden md:table-cell">To</th>
                  <th className="pb-3 md:pr-4 hidden md:table-cell">Days</th>
                  <th className="pb-3 text-center">Status</th>
                </tr>
              </thead>

              <tbody>
                {info.length > 0 ? (
                  info
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((booking) => (
                      <tr
                        key={booking._id}
                        className="border-b text-sm font-medium"
                      >
                        <td className="py-3 md:pr-4">
                          <a
                            href={`/booking/${booking._id}`}
                            className="hover:underline"
                          >
                            {booking.warehouseId.name}
                          </a>
                        </td>
                        <td className="py-3 md:pr-4">
                          <a
                            href={`/booking/${booking._id}`}
                            className="hover:underline"
                          >
                            {booking.userId.name}
                          </a>
                        </td>
                        <td className="pr-4 hidden md:table-cell">
                          <a
                            href={`/booking/${booking._id}`}
                            className="hover:underline"
                          >
                            {booking.warehouseId.size} sq ft
                          </a>
                        </td>
                        <td className="pr-4 hidden md:table-cell">
                          <a
                            href={`/booking/${booking._id}`}
                            className="hover:underline"
                          >
                            {formatDate(booking.startDate)}
                          </a>
                        </td>
                        <td className="pr-4 hidden md:table-cell">
                          <a
                            href={`/booking/${booking._id}`}
                            className="hover:underline"
                          >
                            {formatDate(booking.endDate)}
                          </a>
                        </td>
                        <td className="pr-4 hidden md:table-cell">
                          <a
                            href={`/booking/${booking._id}`}
                            className="hover:underline"
                          >
                            {Math.abs(
                              new Date(booking.endDate) -
                                new Date(booking.startDate)
                            ) /
                              (1000 * 3600 * 24) +
                              1}
                          </a>
                        </td>
                        <td className="text-center">
                          <a
                            href={`/booking/${booking._id}`}
                            className="hover:underline"
                          >
                            <span
                              className={`text-xs font-medium bg-${
                                upcoming.includes(booking)
                                  ? "blue"
                                  : current.includes(booking)
                                  ? "green"
                                  : declined.includes(booking)
                                  ? "red"
                                  : pending.includes(booking)
                                  ? "yellow"
                                  : awaiting.includes(booking)
                                  ? "orange"
                                  : "gray"
                              }-100 text-${
                                upcoming.includes(booking)
                                  ? "blue"
                                  : current.includes(booking)
                                  ? "green"
                                  : declined.includes(booking)
                                  ? "red"
                                  : pending.includes(booking)
                                  ? "yellow"
                                  : awaiting.includes(booking)
                                  ? "orange"
                                  : "gray"
                              }-800 px-2 py-1 rounded-full text-sm`}
                            >
                              {upcoming.includes(booking)
                                ? "Upcoming"
                                : current.includes(booking)
                                ? "Active"
                                : declined.includes(booking)
                                ? "Declined"
                                : pending.includes(booking)
                                ? "Pending"
                                : awaiting.includes(booking)
                                ? "Awaiting Payment"
                                : "Completed"}
                            </span>
                          </a>
                        </td>
                      </tr>
                    ))
                ) : (
                  <p className="text-gray-700">
                    You don't have any recent bookings.
                  </p>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default WarehouseOwnerDashboard;
