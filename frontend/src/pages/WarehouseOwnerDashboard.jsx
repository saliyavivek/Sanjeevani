import React from "react";
import {
  BarChart3,
  Package,
  Calendar,
  MessageSquare,
  Settings,
  PlusCircle,
  LogOut,
} from "lucide-react";

const WarehouseOwnerDashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md">
        <div className="p-4">
          <h1 className="text-2xl font-bold text-blue-600">FarmStore</h1>
        </div>
        <nav className="mt-6">
          <a
            href="#"
            className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 border-r-4 border-blue-600"
          >
            <BarChart3 className="w-5 h-5 mr-3" />
            Dashboard
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
          >
            <Package className="w-5 h-5 mr-3" />
            My Listings
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
          >
            <Calendar className="w-5 h-5 mr-3" />
            Bookings
          </a>
          <a
            href="#"
            className="flex items-center px-4 py-2 mt-2 text-gray-600 hover:bg-gray-100 hover:text-gray-700 transition-colors duration-200"
          >
            <MessageSquare className="w-5 h-5 mr-3" />
            Messages
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
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">
            Welcome back, Sarah!
          </h2>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center hover:bg-blue-700 transition-colors duration-200">
            <PlusCircle className="w-5 h-5 mr-2" />
            Add New Listing
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Active Listings
            </h3>
            <p className="text-3xl font-bold text-blue-600">5</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Total Space
            </h3>
            <p className="text-3xl font-bold text-blue-600">10,000 sq ft</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Occupancy Rate
            </h3>
            <p className="text-3xl font-bold text-blue-600">75%</p>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              Monthly Revenue
            </h3>
            <p className="text-3xl font-bold text-green-600">$12,500</p>
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
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-3">John Doe</td>
                  <td>500 sq ft</td>
                  <td>May 1, 2023</td>
                  <td>Aug 1, 2023</td>
                  <td>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                      Active
                    </span>
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="py-3">Jane Smith</td>
                  <td>750 sq ft</td>
                  <td>Jun 15, 2023</td>
                  <td>Sep 15, 2023</td>
                  <td>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-sm">
                      Pending
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3">Bob Johnson</td>
                  <td>1000 sq ft</td>
                  <td>Jul 1, 2023</td>
                  <td>Oct 1, 2023</td>
                  <td>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                      Active
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Available Space */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
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
        </div>
      </main>
    </div>
  );
};

export default WarehouseOwnerDashboard;
