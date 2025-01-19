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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
        const response = await fetch(
          "http://localhost:8080/api/warehouses/listings",
          {
            method: "POST",
            body: JSON.stringify({
              user: userId,
            }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response.ok) {
          console.log("Error while fetching user bookings.");
          return;
        }
        const data = await response.json();
        setInfo(data.warehouses);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const normalizeDate = (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    return normalizedDate;
  };

  const categorizeBookings = () => {
    const today = normalizeDate(new Date());
    return {
      past: info.reduce(
        (acc, warehouse) =>
          acc.concat(
            warehouse.bookings.filter(
              (booking) => normalizeDate(booking.endDate) < today
            )
          ),
        []
      ),
      current: info.reduce(
        (acc, warehouse) =>
          acc.concat(
            warehouse.bookings.filter(
              (booking) =>
                normalizeDate(booking.startDate) <= today &&
                normalizeDate(booking.endDate) >= today
            )
          ),
        []
      ),
      upcoming: info.reduce(
        (acc, warehouse) =>
          acc.concat(
            warehouse.bookings.filter(
              (booking) => normalizeDate(booking.startDate) > today
            )
          ),
        []
      ),
    };
  };

  const { past, current, upcoming } = categorizeBookings();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-blue-600">FarmStore</h1>
        <button onClick={toggleSidebar} className="text-gray-600">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
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
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-4 lg:p-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6">
          <h2 className="text-2xl lg:text-3xl font-semibold text-gray-800 mb-4 lg:mb-0">
            Welcome back, {name ? name : "Kisan"}!
          </h2>
          <a href="/warehouse/list">
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors duration-200">
              <PlusCircle className="w-5 h-5 mr-2" />
              Add New Listing
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
              {info && info.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-700 mb-2">
              Active Bookings
            </h3>
            <p className="text-2xl lg:text-3xl font-bold text-blue-600">
              {
                info.filter((booking) => booking.availability === "booked")
                  .length
              }
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-700 mb-2">
              Total Space
            </h3>
            <p className="text-2xl lg:text-3xl font-bold text-blue-600">
              {info
                .reduce((acc, curr) => acc + Number(curr.size), 0)
                .toLocaleString()}{" "}
              sq ft
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 lg:p-6">
            <h3 className="text-lg lg:text-xl font-semibold text-gray-700 mb-2">
              Total Revenue
            </h3>
            <p className="text-2xl lg:text-3xl font-bold text-green-600">
              ₹
              {info
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
                  <th className="pb-3 pr-4">Warehouse</th>
                  <th className="pb-3 pr-4">Booked by</th>
                  <th className="pb-3 pr-4">Space</th>
                  <th className="pb-3 pr-4">From</th>
                  <th className="pb-3 pr-4">To</th>
                  <th className="pb-3 pr-4">Days</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {info.map((listing) =>
                  listing.bookings.map((booking) => (
                    <tr key={booking._id} className="border-b">
                      <td className="py-3 pr-4">{listing.name}</td>
                      <td className="py-3 pr-4">{booking.userId.name}</td>
                      <td className="pr-4">{listing.size} sq ft</td>
                      <td className="pr-4">
                        {new Date(booking.startDate).toLocaleDateString()}
                      </td>
                      <td className="pr-4">
                        {new Date(booking.endDate).toLocaleDateString()}
                      </td>
                      <td className="pr-4">
                        {Math.abs(
                          new Date(booking.endDate) -
                            new Date(booking.startDate)
                        ) /
                          (1000 * 3600 * 24) +
                          1}
                      </td>
                      <td>
                        <span
                          className={`bg-${
                            upcoming.includes(booking)
                              ? "blue"
                              : current.includes(booking)
                              ? "green"
                              : "gray"
                          }-100 text-${
                            upcoming.includes(booking)
                              ? "blue"
                              : current.includes(booking)
                              ? "green"
                              : "gray"
                          }-800 px-2 py-1 rounded-full text-sm`}
                        >
                          {upcoming.includes(booking)
                            ? "upcoming"
                            : current.includes(booking)
                            ? "active"
                            : "completed"}
                        </span>
                      </td>
                    </tr>
                  ))
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
