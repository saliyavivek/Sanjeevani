import React, { useEffect, useState } from "react";
import {
  BarChart3,
  Warehouse,
  Calendar,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const FarmerDashboard = () => {
  const token = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      if (decodedToken.role === "owner") {
        navigate("/owner/dashboard");
      }
    }
  }, [token, navigate]);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-green-600">FarmStore</h1>
        </div>
        <nav className="mt-6">
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 border-r-4 border-green-600"
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Dashboard
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
          >
            <Warehouse className="w-5 h-5 mr-3" />
            My Bookings
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
          >
            <Calendar className="w-5 h-5 mr-3" />
            Book Storage
          </a>

          <a
            href="#"
            className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </a>
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <a
            href="#"
            className="flex items-center text-gray-600 hover:text-gray-700 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          Welcome back, John!
        </h2>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Active Bookings
            </h3>
            <p className="text-3xl font-bold text-green-600">3</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Total Storage Used
            </h3>
            <p className="text-3xl font-bold text-green-600">1,250 sq ft</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Upcoming Expiry
            </h3>
            <p className="text-3xl font-bold text-yellow-600">1</p>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Recent Bookings
            </h3>
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-500 border-b">
                  <th className="pb-3">Warehouse</th>
                  <th className="pb-3">Location</th>
                  <th className="pb-3">Space</th>
                  <th className="pb-3">From</th>
                  <th className="pb-3">To</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3">Green Valley Storage</td>
                  <td>Springfield, IL</td>
                  <td>500 sq ft</td>
                  <td>May 1, 2023</td>
                  <td>Aug 1, 2023</td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Harvest Hub Warehouse</td>
                  <td>Bloomington, IN</td>
                  <td>750 sq ft</td>
                  <td>Jun 15, 2023</td>
                  <td>Sep 15, 2023</td>
                </tr>
                <tr>
                  <td className="py-3">Farmstead Facilities</td>
                  <td>Des Moines, IA</td>
                  <td>1000 sq ft</td>
                  <td>Jul 1, 2023</td>
                  <td>Oct 1, 2023</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default FarmerDashboard;
