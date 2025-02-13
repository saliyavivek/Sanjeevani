import { useState } from "react";
import {
  BarChart3,
  Users,
  Warehouse,
  Calendar,
  Settings,
  LogOut,
} from "lucide-react";
import OverviewStats from "../components/OverviewStats";
import RecentBookings from "../components/RecentBookings";
import UserManagement from "../components/UserManagement";
import WarehouseListings from "../components/WarehouseListings";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        {/* <div className="p-4">
          <h1 className="text-2xl font-bold text-green-600">FarmStore Admin</h1>
        </div> */}
        <nav className="mt-6">
          <a
            href="#"
            className={`flex items-center px-4 py-2 ${
              activeTab === "overview"
                ? "text-green-600 bg-green-100 border-r-4 border-green-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("overview")}
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Overview
          </a>
          <a
            href="#"
            className={`flex items-center px-4 py-2 mt-2 ${
              activeTab === "users"
                ? "text-green-600 bg-green-100 border-r-4 border-green-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("users")}
          >
            <Users className="w-5 h-5 mr-3" />
            Users
          </a>
          <a
            href="#"
            className={`flex items-center px-4 py-2 mt-2 ${
              activeTab === "warehouses"
                ? "text-green-600 bg-green-100 border-r-4 border-green-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("warehouses")}
          >
            <Warehouse className="w-5 h-5 mr-3" />
            Warehouses
          </a>
          <a
            href="#"
            className={`flex items-center px-4 py-2 mt-2 ${
              activeTab === "bookings"
                ? "text-green-600 bg-green-100 border-r-4 border-green-600"
                : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={() => setActiveTab("bookings")}
          >
            <Calendar className="w-5 h-5 mr-3" />
            Bookings
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 mt-2 text-gray-700 hover:bg-gray-100"
          >
            <Settings className="w-5 h-5 mr-3" />
            Settings
          </a>
        </nav>
        <div className="absolute bottom-0 w-64 p-4">
          <a
            href="#"
            className="flex items-center text-gray-700 hover:text-gray-900 transition-colors duration-200"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </a>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">
          {activeTab === "overview" && "Dashboard Overview"}
          {activeTab === "users" && "User Management"}
          {activeTab === "warehouses" && "Warehouse Listings"}
          {activeTab === "bookings" && "Booking Management"}
        </h2>

        {activeTab === "overview" && <OverviewStats />}
        {activeTab === "overview" && <RecentBookings />}
        {activeTab === "users" && <UserManagement />}
        {activeTab === "warehouses" && <WarehouseListings />}
      </main>
    </div>
  );
};

export default AdminDashboard;
