import React, { useEffect, useState } from "react";
import {
  MapPin,
  Calendar,
  Package,
  CreditCard,
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import { useLocation } from "react-router-dom";

const StatusBadge = ({ status }) => {
  const statusStyles = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
  };

  const statusIcons = {
    pending: <AlertCircle className="w-4 h-4 mr-1" />,
    confirmed: <CheckCircle className="w-4 h-4 mr-1" />,
    cancelled: <XCircle className="w-4 h-4 mr-1" />,
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
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
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
  const location = useLocation();
  const { bookingData } = location.state;

  console.log(bookingData);

  //   useEffect(() => {
  // if (bookingData) {
  //   setBooking(bookingData);
  // }
  //   }, [location.state]);

  const handlePayment = () => {
    // Simulating payment process
    setTimeout(() => {
      setBooking({ ...booking, status: "confirmed" });
      setIsPaymentModalOpen(false);
    }, 1000);
  };

  const handleCancel = () => {
    setBooking({ ...booking, status: "cancelled" });
    setIsCancelModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Booking Details
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {bookingData.warehouseId.name}
                  </h2>
                  <StatusBadge status={bookingData.status} />
                </div>
                <img
                  src={bookingData.warehouseId.images[0]}
                  alt={bookingData.warehouseId.name}
                  className="w-full h-64 object-cover rounded-lg mb-6"
                />
                <div className="space-y-4">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>
                      {bookingData.warehouseId.location.formattedAddress}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>
                      {format(bookingData.startDate, "MMM d, yyyy")} -{" "}
                      {format(bookingData.endDate, "MMM d, yyyy")}
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Package className="w-5 h-5 mr-2 flex-shrink-0" />
                    <span>{bookingData.warehouseId.size} sq ft.</span>
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 mt-6 pt-6 px-6 pb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {/* <img
                      src={bookingData.host.image}
                      alt={bookingData.host.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">{booking.host.name}</p>
                      <p className="text-sm text-gray-500">Host</p>
                    </div> */}
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
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-xl font-semibold mb-4">Price Details</h3>
              <div className="flex justify-between items-center mb-4">
                <span>Total Price</span>
                <span className="text-2xl font-bold">
                  ₹{bookingData.totalPrice.toLocaleString()}
                </span>
              </div>
              <div className="border-t border-gray-200 my-4"></div>
              <div className="space-y-4">
                {bookingData.status === "pending" && (
                  <button
                    onClick={() => setIsPaymentModalOpen(true)}
                    className="w-full bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Complete Payment
                  </button>
                )}
                {bookingData.status !== "cancelled" && (
                  <button
                    onClick={() => setIsCancelModalOpen(true)}
                    className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Complete Payment"
      >
        <p className="mb-4">
          Total Amount: ₹{bookingData.totalPrice.toLocaleString()}
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
            className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
          >
            Pay Now
          </button>
        </div>
      </Modal>

      {/* Cancel Modal */}
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
