import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Check, X, User } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { showSuccessToast } from "../components/toast";

const BookingRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchBookings = async () => {
    try {
      if (token) {
        const { userId } = jwtDecode(token);
        const response = await fetch(
          `${API_BASE_URL}/bookings/booking-requests`,
          {
            method: "POST",
            body: JSON.stringify({ userId }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          // console.log(data);
          setLoading(false);
          setRequests(data.bookings);
        }
        //   setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching pending bookings:", error);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, [token]);

  const handleApprove = async (requestId, userId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/bookings/booking-requests/${requestId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            approvalStatus: "approved",
            userId,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      showSuccessToast("Request has been approved.");
      //   console.log(data);
      setLoading(false);
      setRequests(
        requests.map((request) =>
          request._id === requestId
            ? { ...request, status: "approved" }
            : request
        )
      );
    } catch (error) {
      console.error("Error approving request:", error);
    }
  };

  const handleDecline = async (requestId, userId) => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/bookings/booking-requests/${requestId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            approvalStatus: "rejected",
            userId,
          }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = await response.json();
      //   console.log(data);
      showSuccessToast("Request has been declined.");
      setLoading(false);

      setRequests(
        requests.map((request) =>
          request._id === requestId
            ? { ...request, status: "declined" }
            : request
        )
      );
    } catch (error) {
      console.error("Error declining request:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[100vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold mb-6">Booking Requests</h1>
      <div className="space-y-4">
        {requests.map((request) => (
          <div
            key={request._id}
            className="bg-white rounded-lg overflow-hidden"
          >
            <div className="p-4">
              <div className="flex justify-between items-center mb-2">
                <h2 className="text-lg font-bold">
                  {request.warehouseId.name}
                </h2>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    request.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : request.status === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {request.status.charAt(0).toUpperCase() +
                    request.status.slice(1)}
                </span>
              </div>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/3">
                  <img
                    src={request.warehouseId.images[0] || "/placeholder.svg"}
                    alt={request.warehouseId.name}
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
                <div className="w-full md:w-2/3 space-y-2">
                  <div className="flex items-center space-x-2">
                    {request.userId.avatar ? (
                      <img
                        src={request.userId.avatar || "/placeholder.svg"}
                        alt={request.userId.name}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-500" />
                      </div>
                    )}
                    <span className="font-medium">{request.userId.name}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    From: {format(new Date(request.startDate), "MMM dd, yyyy")}
                  </p>
                  <p className="text-sm text-gray-500">
                    To: {format(new Date(request.endDate), "MMM dd, yyyy")}
                  </p>
                  <p className="font-semibold">
                    Total Price: ₹{request.totalPrice.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
            {request.status === "pending" && (
              <div className="px-4 py-3 flex justify-end space-x-2">
                <button
                  onClick={() => handleDecline(request._id, request.userId._id)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <X className="inline-block w-4 h-4 mr-2" />
                  Decline
                </button>
                <button
                  onClick={() => handleApprove(request._id, request.userId._id)}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <Check className="inline-block w-4 h-4 mr-2" />
                  Approve
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {requests.length <= 0 && (
        <div className="py-40 flex flex-column justify-center items-center">
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No requests at this moment.
          </h3>
        </div>
      )}
    </div>
  );
};

export default BookingRequests;
