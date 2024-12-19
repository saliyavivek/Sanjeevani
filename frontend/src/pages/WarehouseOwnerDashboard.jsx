import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Package,
  Calendar,
  MessageSquare,
  Settings,
  PlusCircle,
  LogOut,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const WarehouseOwnerDashboard = () => {
  const token = useAuth();
  // const navigate = useNavigate();
  const [name, setName] = useState("");
  const [userId, setUserId] = useState(null);
  const [info, setInfo] = useState([]);

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
        // console.log(info);
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

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        {/* <div className="p-4">
          <h1 className="text-2xl font-bold text-blue-600">FarmStore</h1>
        </div> */}
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
          {/* <a
            href="/bookings"
            className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
          >
            <Calendar className="w-5 h-5 mr-3" />
            Bookings
          </a> */}

          <a
            href="/settings"
            className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </a>
        </nav>
        {/* <div className="absolute bottom-0 w-64 p-4">
          <a
            href="#"
            className="flex items-center text-gray-600 hover:text-gray-700 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </a>
        </div> */}
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Active Listings
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {info && info.length}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Total Space
            </h3>
            <p className="text-3xl font-bold text-blue-600">
              {info
                .reduce((acc, curr) => acc + Number(curr.size), 0)
                .toLocaleString()}{" "}
              sq ft
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Total Revenue
            </h3>
            <p className="text-3xl font-bold text-green-600">
              ₹
              {info
                .filter((listing) => listing.availability === "booked")
                .reduce((acc, curr) => {
                  // Ensure bookings is always an array
                  const bookings = Array.isArray(curr.bookings)
                    ? curr.bookings
                    : [curr.bookings];

                  // Calculate revenue for each booking in the array
                  const revenueForListing = bookings.reduce(
                    (bookingAcc, booking) => {
                      const startDate = new Date(booking.startDate);
                      const endDate = new Date(booking.endDate);
                      const difference = Math.abs(endDate - startDate);
                      const days = difference / (1000 * 3600 * 24) + 1; // Inclusive of both start and end date
                      const pricePerDay = parseFloat(curr.pricePerDay) || 0; // Handle invalid values
                      return bookingAcc + days * pricePerDay;
                    },
                    0
                  );

                  // Accumulate revenue for all listings
                  return acc + revenueForListing;
                }, 0)
                .toLocaleString()}
            </p>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Recent Bookings
            </h3>
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3">Farmer</th>
                  <th className="pb-3">Space</th>
                  <th className="pb-3">From</th>
                  <th className="pb-3">To</th>
                  <th className="pb-3">Days</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {info.map((listing) =>
                  listing.bookings.map((booking) => (
                    <tr key={booking._id} className="border-b">
                      <td className="py-3">{booking.userId.name}</td>
                      <td>{listing.size} sq ft</td>
                      <td>
                        {new Date(booking.startDate).toLocaleDateString()}
                      </td>
                      <td>{new Date(booking.endDate).toLocaleDateString()}</td>
                      <td>
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

        {/* Available Space */}
        {/* <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Available Space
            </h3>
            <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full"
                style={{ width: "75%" }}
              ></div>
            </div>
            <p className="mt-2 text-gray-600">
              7,500 sq ft out of 10,000 sq ft occupied
            </p>
          </div>
        </div> */}
      </main>
    </div>
  );
};

export default WarehouseOwnerDashboard;
