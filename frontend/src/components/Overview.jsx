import {
  Users,
  Warehouse,
  Calendar,
  TrendingUp,
  IndianRupeeIcon,
} from "lucide-react";
import { useEffect, useState } from "react";

const Overview = () => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalWarehouses, setTotalWarehouses] = useState(0);
  const [totalBookings, setTotalBookings] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchTotalUsers = async () => {
    const response = await fetch(`${API_BASE_URL}/users/total-users`);
    if (!response.ok) {
      console.log("Failed to fetch user count.");
      return;
    }
    const data = await response.json();
    setTotalUsers(data.totalUsers);
  };

  const fetchTotalWarehouses = async () => {
    const response = await fetch(`${API_BASE_URL}/warehouses/total-warehouses`);
    if (!response.ok) {
      console.log("Failed to fetch warehouse count.");
      return;
    }
    const data = await response.json();
    setTotalWarehouses(data.totalWarehouses);
  };

  const fetchAdminCommission = async () => {
    const response = await fetch(`${API_BASE_URL}/bookings/commission`);
    if (!response.ok) {
      console.log("Failed to fetch admin commission.");
      return;
    }
    const data = await response.json();
    setRevenue(data.totalCommission);
  };

  const fetchAllBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/all-bookings`);
      if (!response.ok) {
        console.log("Error while fetching all bookings.");
        return;
      }
      const data = await response.json();
      setTotalBookings(data.length);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTotalUsers();
    fetchTotalWarehouses();
    fetchAdminCommission();
    fetchAllBookings();
  });

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
      <div className="flex items-center">
        <div className={`rounded-full p-3 ${color}`}>
          <Icon size={24} className="text-white" />
        </div>
        <div className="ml-4">
          <h3 className="text-base md:text-lg font-semibold text-gray-700">
            {title}
          </h3>
          <p className="text-xl md:text-2xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
        Dashboard Overview
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard
          title="Total Users"
          value={totalUsers}
          icon={Users}
          color="bg-blue-500"
        />
        <StatCard
          title="Total Warehouses"
          value={totalWarehouses}
          icon={Warehouse}
          color="bg-green-500"
        />
        <StatCard
          title="Active Bookings"
          value={totalBookings}
          icon={Calendar}
          color="bg-yellow-500"
        />
        <StatCard
          title="Monthly Revenue"
          value={`₹${revenue.toLocaleString()}`}
          icon={TrendingUp}
          color="bg-purple-500"
        />
      </div>
      <div className="mt-6 md:mt-8">
        <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">
          Recent Activity
        </h3>
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
          <ul className="space-y-4">
            <li className="flex items-center text-sm md:text-base text-gray-700">
              <Calendar size={16} className="mr-2 flex-shrink-0" />
              <span>New booking: Warehouse #12 - 2 hours ago</span>
            </li>
            <li className="flex items-center text-sm md:text-base text-gray-700">
              <Users size={16} className="mr-2 flex-shrink-0" />
              <span>New user registration: John Doe - 5 hours ago</span>
            </li>
            <li className="flex items-center text-sm md:text-base text-gray-700">
              <Warehouse size={16} className="mr-2 flex-shrink-0" />
              <span>Warehouse #8 capacity updated - 1 day ago</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Overview;
