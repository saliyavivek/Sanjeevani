import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users,
  Warehouse,
  Calendar,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import Overview from "../components/Overview";
import UserManagement from "../components/UserManagement";
import WarehouseManagement from "../components/WarehouseManagement";
import BookingManagement from "../components/BookingManagement";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { showErrorToast } from "../components/toast";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const token = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const { role } = jwtDecode(token);
      if (role !== "admin") {
        return navigate(-1);
      }
    }
  }, [token]);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <Overview />;
      case "users":
        return <UserManagement />;
      case "warehouses":
        return <WarehouseManagement />;
      case "bookings":
        return <BookingManagement />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transition-all duration-300 transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0`}
      >
        <div className="p-4">
          <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
        </div>
        <nav className="mt-8">
          <a
            href="#"
            className={`flex items-center px-4 py-3 ${
              activeTab === "overview"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => {
              setActiveTab("overview");
              setIsSidebarOpen(false);
            }}
          >
            <LayoutDashboard className="mr-3" size={20} />
            Overview
          </a>
          <a
            href="#"
            className={`flex items-center px-4 py-3 ${
              activeTab === "users"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => {
              setActiveTab("users");
              setIsSidebarOpen(false);
            }}
          >
            <Users className="mr-3" size={20} />
            Users
          </a>
          <a
            href="#"
            className={`flex items-center px-4 py-3 ${
              activeTab === "warehouses"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => {
              setActiveTab("warehouses");
              setIsSidebarOpen(false);
            }}
          >
            <Warehouse className="mr-3" size={20} />
            Warehouses
          </a>
          <a
            href="#"
            className={`flex items-center px-4 py-3 ${
              activeTab === "bookings"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
            onClick={() => {
              setActiveTab("bookings");
              setIsSidebarOpen(false);
            }}
          >
            <Calendar className="mr-3" size={20} />
            Bookings
          </a>
        </nav>
        {/* <div className="absolute bottom-0 w-full p-4">
          <a
            href="#"
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <LogOut className="mr-3" size={20} />
            Logout
          </a>
        </div> */}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-gray-600 focus:outline-none lg:hidden"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <div className="text-gray-600">Welcome, Admin</div>
          </div>
        </header>
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
