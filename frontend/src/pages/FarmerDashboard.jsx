import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Warehouse,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const FarmerDashboard = () => {
  const token = useAuth();
  const [userId, setUserId] = useState(null);
  const [info, setInfo] = useState([]);
  const [name, setName] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
      setName(decodedToken.name);
    }
  }, [token]);

  useEffect(() => {
    fetchUserBookingsData();
  }, [userId]);

  const fetchUserBookingsData = async () => {
    try {
      if (userId) {
        const response = await fetch(
          "http://localhost:8080/api/bookings/getall",
          {
            method: "POST",
            body: JSON.stringify({
              userId,
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
        setInfo(data);
        console.log(data);
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
      past: info.filter((booking) => normalizeDate(booking.endDate) < today),
      current: info.filter(
        (booking) =>
          normalizeDate(booking.startDate) <= today &&
          normalizeDate(booking.endDate) >= today
      ),
      upcoming: info.filter(
        (booking) => normalizeDate(booking.startDate) > today
      ),
    };
  };

  const { past, current, upcoming } = categorizeBookings();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      {/* Mobile Header */}
      <header className="md:hidden bg-white shadow-md p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-green-600">FarmStore</h1>
        <button onClick={toggleSidebar} className="text-gray-600">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? "block" : "hidden"
        } md:block w-full md:w-64 bg-white shadow-md`}
      >
        <nav className="mt-6">
          <a
            href="/farmer/dashboard"
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 border-r-4 border-green-600"
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Dashboard
          </a>
          <a
            href="/bookings"
            className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
          >
            <Warehouse className="w-5 h-5 mr-3" />
            My Bookings
          </a>
          <a
            href="/warehouses/search"
            className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
          >
            <Calendar className="w-5 h-5 mr-3" />
            Book Storage
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
      <main className="flex-1 overflow-y-auto p-4 md:p-8">
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6">
          Welcome back, {name ? name : "John"}!
        </h2>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
              Active Bookings
            </h3>
            <p className="text-2xl md:text-3xl font-bold text-green-600">
              {info.filter((booking) => booking.status === "active").length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
              Total Storage Used
            </h3>
            <p className="text-2xl md:text-3xl font-bold text-green-600">
              {info
                .reduce((acc, curr) => acc + Number(curr.warehouseId.size), 0)
                .toLocaleString()}{" "}
              sq ft
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
              Upcoming Expiry
            </h3>
            <p className="text-2xl md:text-3xl font-bold text-yellow-600">
              {
                info.filter((booking) => {
                  const endDate = normalizeDate(booking.endDate);
                  const now = normalizeDate(new Date());
                  return (
                    endDate >= now && endDate - now <= 2 * 24 * 60 * 60 * 1000
                  );
                }).length
              }
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-4 md:p-6">
            <h3 className="text-lg md:text-xl font-semibold text-gray-700 mb-2">
              Total Expense
            </h3>
            <p className="text-2xl md:text-3xl font-bold text-green-600">
              ₹
              {info
                .reduce((acc, curr) => acc + curr.totalPrice, 0)
                .toLocaleString()}
            </p>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 md:p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Recent Bookings
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-gray-500 border-b">
                    <th className="pb-3 pr-2">Warehouse</th>
                    <th className="pb-3 pr-2">Location</th>
                    <th className="pb-3 pr-2">Space</th>
                    <th className="pb-3 pr-2">From</th>
                    <th className="pb-3 pr-2">To</th>
                    <th className="pb-3 pr-2">Days</th>
                    <th className="pb-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {info.map((booking, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 pr-2">
                        <a
                          href={`/booking/${booking._id}`}
                          className="hover:underline"
                        >
                          {booking.warehouseId.name}
                        </a>
                      </td>
                      <td className="pr-2">
                        <a
                          href={`/booking/${booking._id}`}
                          className="hover:underline"
                        >
                          {booking.warehouseId.location.formattedAddress
                            .length > 50
                            ? `${booking.warehouseId.location.formattedAddress.substring(
                                0,
                                50
                              )}...`
                            : booking.warehouseId.location.formattedAddress}
                        </a>
                      </td>
                      <td className="pr-2">
                        <a
                          href={`/booking/${booking._id}`}
                          className="hover:underline"
                        >
                          {booking.warehouseId.size} sq ft
                        </a>
                      </td>
                      <td className="pr-2">
                        <a
                          href={`/booking/${booking._id}`}
                          className="hover:underline"
                        >
                          {new Date(booking.startDate).toLocaleDateString()}
                        </a>
                      </td>
                      <td className="pr-2">
                        <a
                          href={`/booking/${booking._id}`}
                          className="hover:underline"
                        >
                          {new Date(booking.endDate).toLocaleDateString()}
                        </a>
                      </td>
                      <td className="pr-2">
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
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;
