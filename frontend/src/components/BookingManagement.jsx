import { useEffect, useState } from "react";
import { Search, Calendar, User, Warehouse } from "lucide-react";

const BookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchAllBookings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/all-bookings`);
      if (!response.ok) {
        console.log("Error while fetching all bookings.");
        return;
      }
      const data = await response.json();
      console.log(data);
      setBookings(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllBookings();
  }, []);

  const normalizeDate = (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    return normalizedDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredBookings = bookings.filter(
    (booking) =>
      booking.userId.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.warehouseId.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      booking.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
        Booking Management
      </h2>
      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search bookings..."
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-2 text-gray-400" size={20} />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr className="text-gray-700 text-sm leading-normal">
              <th className="py-3 px-6 text-left">Booked by</th>
              <th className="py-3 px-6 text-left hidden sm:table-cell">
                Warehouse
              </th>
              <th className="py-3 pr-6 text-left hidden md:table-cell">
                Owner
              </th>
              <th className="py-3 px-6 text-left hidden md:table-cell">
                Start Date
              </th>
              <th className="py-3 px-6 text-left hidden lg:table-cell">
                End Date
              </th>
              <th className="py-3 px-6 text-left">Status</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {filteredBookings
              .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
              .map((booking) => (
                <tr
                  key={booking.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-6">
                    <div className="flex items-center">
                      <User size={16} className="mr-2 text-gray-400" />
                      <div>
                        <p className="font-medium">{booking.userId.name}</p>
                        <p className="text-xs text-gray-500 sm:hidden">
                          {booking.warehouseId.name}
                        </p>
                        <p className="text-xs text-gray-500 md:hidden">
                          {normalizeDate(booking.startDate)}
                        </p>
                        <p className="text-xs text-gray-500 lg:hidden">
                          {normalizeDate(booking.endDate)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-6 hidden sm:table-cell">
                    <div className="flex items-center">
                      <Warehouse size={16} className="mr-2 text-gray-400" />
                      {booking.warehouseId.name}
                    </div>
                  </td>
                  <td className="text-gray-500 hidden md:table-cell">
                    {booking.warehouseId.ownerId.name}
                  </td>
                  <td className="py-3 px-6 hidden md:table-cell">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-gray-400" />
                      {normalizeDate(booking.startDate)}
                    </div>
                  </td>
                  <td className="py-3 px-6 hidden lg:table-cell">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2 text-gray-400" />
                      {normalizeDate(booking.endDate)}
                    </div>
                  </td>
                  <td className="py-3 px-6">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        booking.status === "completed"
                          ? "bg-gray-200 text-gray-800"
                          : booking.status === "pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : booking.status === "active"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BookingManagement;
