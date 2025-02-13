import { useEffect, useState } from "react";

const RecentBookings = () => {
  const [bookings, setBookings] = useState([]);

  const fetchAllBookings = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/bookings/all-bookings"
      );
      if (!response.ok) {
        console.log("Error while fetching all bookings.");
        return;
      }
      const data = await response.json();
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

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">
          Recent Bookings
        </h3>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3 font-medium">Farmer</th>
              <th className="pb-3 font-medium">Warehouse</th>
              <th className="pb-3 font-medium">Date</th>
              <th className="pb-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .slice(0, 10)
              .map((booking) => (
                <tr key={booking.id} className="border-b last:border-b-0">
                  <td className="py-3">{booking.userId.name}</td>
                  <td>{booking.warehouseId.name}</td>
                  <td>
                    {booking.createdAt ? normalizeDate(booking.createdAt) : ""}
                  </td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        booking.status === "completed"
                          ? "bg-gray-100 text-gray-800"
                          : booking.status === "pending"
                          ? "bg-yellow-100 text-yellow-800"
                          : booking.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-blue-100 text-blue-800"
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

export default RecentBookings;
