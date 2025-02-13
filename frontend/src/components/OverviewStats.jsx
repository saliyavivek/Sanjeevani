import { Users, Warehouse, TrendingUp, IndianRupeeIcon } from "lucide-react";
import { useEffect, useState } from "react";

const OverviewStats = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalWarehouses, setTotalWarehouses] = useState(0);
  const [revenue, setRevenue] = useState(0);

  const fetchTotalUsers = async () => {
    const response = await fetch("http://localhost:8080/api/users/total-users");
    if (!response.ok) {
      console.log("Failed to fetch user count.");
      return;
    }
    const data = await response.json();
    setTotalUsers(data.totalUsers);
  };

  const fetchTotalWarehouses = async () => {
    const response = await fetch(
      "http://localhost:8080/api/warehouses/total-warehouses"
    );
    if (!response.ok) {
      console.log("Failed to fetch warehouse count.");
      return;
    }
    const data = await response.json();
    setTotalWarehouses(data.totalWarehouses);
  };

  const fetchAdminCommission = async () => {
    const response = await fetch(
      "http://localhost:8080/api/bookings/commission"
    );
    if (!response.ok) {
      console.log("Failed to fetch admin commission.");
      return;
    }
    const data = await response.json();
    setRevenue(data.totalCommission);
  };

  useEffect(() => {
    fetchTotalUsers();
    fetchTotalWarehouses();
    fetchAdminCommission();
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Users</p>
            <p className="text-2xl font-semibold text-gray-800">{totalUsers}</p>
          </div>
        </div>
        <div className="mt-4">
          <span className="text-green-600 text-sm font-semibold">+5.2%</span>
          <span className="text-gray-500 text-sm ml-2">from last month</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
            <Warehouse className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Warehouses</p>
            <p className="text-2xl font-semibold text-gray-800">
              {totalWarehouses}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <span className="text-green-600 text-sm font-semibold">+3.1%</span>
          <span className="text-gray-500 text-sm ml-2">from last month</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-yellow-100 text-yellow-600 mr-4">
            <IndianRupeeIcon className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Total Revenue</p>
            <p className="text-2xl font-semibold text-gray-800">
              ₹{revenue.toLocaleString()}
            </p>
          </div>
        </div>
        <div className="mt-4">
          <span className="text-green-600 text-sm font-semibold">+7.8%</span>
          <span className="text-gray-500 text-sm ml-2">from last month</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-gray-500 text-sm">Occupancy Rate</p>
            <p className="text-2xl font-semibold text-gray-800">78%</p>
          </div>
        </div>
        <div className="mt-4">
          <span className="text-green-600 text-sm font-semibold">+2.5%</span>
          <span className="text-gray-500 text-sm ml-2">from last month</span>
        </div>
      </div>
    </div>
  );
};

export default OverviewStats;
