import React, { useEffect, useState } from "react";
import {
  MapPin,
  Calendar,
  Package,
  AlertCircle,
  CheckCircle,
  PhoneCall,
  User,
  Clock,
  Check,
  ArrowLeft,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import generateInvoice from "../utils/generateInvoice";
// import { toast } from "sonner";
import { showErrorToast, showSuccessToast } from "../components/toast";
// import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";

const StatusBadge = ({ status }) => {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    active: "bg-green-100 text-green-800",
    upcoming: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    declined: "bg-red-100 text-red-800",
  };

  const statusIcons = {
    pending: <AlertCircle className="w-4 h-4 mr-1" />,
    active: <CheckCircle className="w-4 h-4 mr-1" />,
    upcoming: <Clock className="w-4 h-4 mr-1" />,
    completed: <Check className="w-4 h-4 mr-1" />,
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${statusStyles[status]}`}
    >
      {statusIcons[status]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">
        {" "}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-xl font-semibold mb-4">{title}</h3>
        {children}
      </div>
    </div>
  );
};

const BookingDetails = () => {
  //   const [booking, setBooking] = useState({});
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [booking, setBooking] = useState(null);
  const [warehouseId, setWarehouseId] = useState("");
  const [userId, setUserId] = useState("");
  // const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  // const token = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [paidBooking, setPaidBooking] = useState(null);
  const [paying, setPaying] = useState(false);

  // console.log(token);
  useEffect(() => {
    const token = localStorage.getItem("token");
    // console.log(token);

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.userId);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const fetchBookingDetails = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      // console.log(data);
      setBooking(data);
      setWarehouseId(data.warehouseId._id);

      if (
        data.status !== "pending" &&
        data.status !== "declined" &&
        data.approvalStatus === "approved"
      ) {
        setPaidBooking(data);
      }

      // if (booking?.status === "active") {
      //   setBooking({ ...booking, status: "confirmed" });
      // }
    } catch (error) {
      console.error("Failed to fetch booking details:", error.message);
    }
  };

  useEffect(() => {
    fetchBookingDetails();
    // console.log(booking);
  }, [id]);

  if (!booking) {
    return null; // Render loading state
  }

  const handlePayment = async () => {
    setPaying(true);
    const response = await fetch(`${API_BASE_URL}/bookings/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        warehouseId,
        userId,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      showErrorToast("Failed to process payment.");
      // console.error("Failed to process payment.");
      return;
    }
    const data = await response.json();
    showSuccessToast("Payment successfull.");
    setPaying(false);
    // console.log(data.message, data.booking);
    // console.log(data.booking);
    // generateInvoice(data.booking);
    setPaidBooking(data.booking);

    setTimeout(() => {
      setBooking({ ...booking, status: "active" });
      setIsPaymentModalOpen(false);
    }, 1000);
  };

  const handleDownloadInvoice = () => {
    if (paidBooking) {
      generateInvoice(paidBooking);
    }
  };

  const handleCancel = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/bookings/${booking._id}`, {
        method: "DELETE",
        body: JSON.stringify({
          userId,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        // console.log(data.message);
        // setBooking({ ...booking, status: "cancelled" });
        setIsCancelModalOpen(false);
        showSuccessToast("Your booking has been cancelled.");
        navigate("/bookings");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const handleBookingCompleted = async (req, res) => {
  //   try {
  //     const response = await fetch(
  //       `http://localhost:8080/api/bookings/completed/${booking._id}`,
  //       {
  //         method: "POST",
  //         body: JSON.stringify({
  //           warehouseId,
  //         }),
  //         headers: {
  //           "Content-Type": "application/json",
  //         },
  //       }
  //     );
  //     if (response.ok) {
  //       const data = await response.json();
  //       console.log(data.message);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  const normalizeDate = (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    return normalizedDate;
  };

  return (
    <div className="min-h-screen bg-white-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 md:gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="md:p-2 rounded-full hover:bg-gray-50 transition-colors duration-200"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-3xl font-semibold text-gray-900">
            Booking Details
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg overflow-hidden">
              <div className="md:p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
                    {booking.warehouseId.name}
                  </h2>
                  {/* {new Date(booking.startDate) > new Date() ? (
                    <StatusBadge status="upcoming" />
                  ) : (
                    <StatusBadge status={booking.status} />
                  )} */}
                  {booking.status !== "pending" &&
                  normalizeDate(booking.startDate) >
                    normalizeDate(new Date()) ? (
                    <StatusBadge status="upcoming" />
                  ) : normalizeDate(new Date()) >
                    normalizeDate(booking.endDate) ? (
                    <StatusBadge status="completed" />
                  ) : (
                    <StatusBadge status={booking.status} />
                  )}
                </div>
                <img
                  src={booking.warehouseId.images[0]}
                  alt={booking.warehouseId.name}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>{booking.warehouseId.location.formattedAddress}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>
                      {format(booking.startDate, "MMM d, yyyy")} -{" "}
                      {format(booking.endDate, "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Package className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>{booking.warehouseId.size} sq ft.</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 mt-6 pt-6 md:px-6 md:pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <img
                      src={booking.warehouseId.ownerId.avatar}
                      alt={booking.warehouseId.ownerId.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold">
                        {booking.warehouseId.ownerId.name}
                      </p>
                      <p className="text-sm text-gray-500 flex items-center justify-center">
                        <PhoneCall className="w-3 h-3 mr-1 flex-shrink-0 mt-1" />
                        {booking.warehouseId.ownerId.phoneno}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {/* <p className="font-semibold">{booking.host.rating} ★</p>
                    <p className="text-sm text-gray-500">
                      Responds {booking.host.responseTime}
                    </p> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="bg-white rounded-lg md:p-6">
              <h3 className="text-xl font-semibold mb-4">Price Details</h3>
              <div className="flex justify-between items-center mb-4">
                <span>Total Price</span>
                <span className="text-2xl font-bold">
                  ₹{booking.totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="space-y-4">
                {booking.status === "pending" && (
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    disabled={booking.approvalStatus === "pending"}
                    className={`w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors
                        ${
                          booking.approvalStatus === "pending"
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }
                      `}
                    title={
                      booking.approvalStatus === "pending"
                        ? "Wait for owner's approval"
                        : ""
                    }
                  >
                    Make a Payment
                  </button>
                )}

                <button
                  onClick={() => setIsCancelModalOpen(true)}
                  disabled={
                    booking.status === "active" ||
                    booking.status === "completed" ||
                    booking.status === "declined"
                  }
                  className={`w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-100 transition-colors ${
                    booking.status === "active" ||
                    booking.status === "completed" ||
                    booking.status === "declined"
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                  title={
                    booking.status === "declined"
                      ? "Your request has already been declined"
                      : ""
                  }
                >
                  Cancel Booking
                </button>

                {paidBooking && (
                  <button
                    onClick={handleDownloadInvoice}
                    className="w-full border bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Download Invoice
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Complete Payment"
      >
        <p className="mb-4">
          Total Amount: ₹{booking.totalPrice.toLocaleString()}
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setIsPaymentModalOpen(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handlePayment}
            disabled={paying}
            className={`px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors
              ${paying ? "opacity-50 cursor-not-allowes" : ""}
              `}
          >
            {paying ? "Processing..." : "Pay Now"}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel Booking"
      >
        <p className="mb-4">
          Are you sure you want to cancel this booking? This action cannot be
          undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={() => setIsCancelModalOpen(false)}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            No, Keep Booking
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Yes, Cancel Booking
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default BookingDetails;
