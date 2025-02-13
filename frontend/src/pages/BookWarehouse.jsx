import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { ArrowLeft, Info, MapPin } from "lucide-react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import "leaflet/dist/leaflet.css";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { showErrorToast, showSuccessToast } from "../components/toast";

const theme = createTheme({
  palette: {
    primary: {
      main: "#10B981", // Tailwind's emerald-500
    },
  },
});

const BookWarehouse = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { warehouse } = location.state;

  if (!warehouse) {
    navigate(-1);
    return null;
  }

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // const [totalPrice, setTotalPrice] = useState(0);
  const [commissionFee, setCommissionFee] = useState(0);
  const [basePrice, setBasePrice] = useState(0);
  const [userId, setUserId] = useState("");

  const token = useAuth();

  useEffect(() => {
    if (token) {
      const { userId } = jwtDecode(token);
      setUserId(userId);
    }
  }, [token]);

  const calculateDays = (start, end) => {
    if (!start || !end) return 0;
    return end.diff(start, "day");
  };

  const updateBasePrice = (start, end) => {
    const days = calculateDays(start, end);
    const newBasePrice = days * warehouse.pricePerDay;
    setBasePrice(newBasePrice);
    setCommissionFee(newBasePrice * 0.1);
  };

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
    updateBasePrice(newValue, endDate);
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
    updateBasePrice(startDate, newValue);
  };

  const handleBooking = async () => {
    try {
      if (!startDate || !endDate) {
        showErrorToast("Please select both start and end dates");
        return;
      }

      const response = await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          warehouseId: warehouse._id,
          userId,
          startDate,
          endDate,
          basePrice,
          commissionFee,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        showSuccessToast("Make a payment to proceed.");
        navigate(`/booking/${data.booking._id}`);
      } else {
        const error = await response.json();
        showErrorToast(error.message);
      }
    } catch (error) {
      console.error(error);
      showErrorToast("An error occurred while booking. Please try again.");
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row min-h-screen">
              {/* Booking Form Section */}
              <div className="w-full lg:w-1/2 p-4 sm:p-6 md:p-8 lg:p-12 flex items-center">
                <div className="w-full max-w-lg mx-auto">
                  <div className="flex items-center gap-2 mb-6">
                    <button
                      onClick={() => navigate(-1)}
                      className="md:p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
                      aria-label="Go back"
                    >
                      <ArrowLeft className="h-5 w-5 text-gray-600" />
                    </button>
                    <h1 className="text-2xl sm:text-3xl font-semibold text-gray-900">
                      Confirm Dates
                    </h1>
                  </div>
                  <div className="mb-6">
                    <h1 className="text-6xl sm:text-4xl md:text-5xl font-bold text-gray-900 tracking-tight">
                      ₹{warehouse.pricePerDay.toLocaleString()}
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-600 mt-1">
                      per day
                    </p>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-4">
                      <DatePicker
                        label="Check-in Date"
                        value={startDate}
                        onChange={handleStartDateChange}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth />
                        )}
                        disablePast
                      />
                      <DatePicker
                        label="Check-out Date"
                        value={endDate}
                        onChange={handleEndDateChange}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth />
                        )}
                        disablePast
                        minDate={startDate}
                      />
                    </div>

                    {/* {totalPrice > 0 && (
                      <div className="space-y-3 pt-4">
                        <div className="flex justify-between items-center text-base sm:text-lg">
                          <span className="text-gray-600">
                            ₹{warehouse.pricePerDay.toLocaleString()} ×{" "}
                            {calculateDays(startDate, endDate)} days
                          </span>
                          <span className="text-gray-900 font-medium">
                            ₹{totalPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between items-center text-base sm:text-lg border-t border-gray-200">
                          <span className="text-gray-600">
                            ₹{warehouse.pricePerDay.toLocaleString()} ×{" "}
                            {calculateDays(startDate, endDate)} days
                          </span>
                          <span className="text-gray-900 font-medium">
                            ₹{totalPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-between items-center text-lg sm:text-xl font-semibold">
                            <span>Total</span>
                            <span>₹{totalPrice.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    )} */}

                    {basePrice > 0 && (
                      <div className="bg-white rounded-xl py-6 max-w-md">
                        <h2 className="text-xl font-semibold text-gray-900 mb-6">
                          Price Breakdown
                        </h2>

                        {/* Price Calculations */}
                        <div className="space-y-4">
                          {/* Base Price */}
                          <div className="flex justify-between border-b pb-4 items-start">
                            <div className="space-y-1">
                              <p className="text-gray-700">Listed Price</p>
                              <p className="text-sm text-gray-500">
                                ₹{warehouse.pricePerDay.toLocaleString()} ×{" "}
                                {calculateDays(startDate, endDate)} days
                              </p>
                            </div>
                            <span className="text-gray-900 font-medium">
                              ₹{basePrice.toLocaleString()}
                            </span>
                          </div>

                          {/* Platform Fee */}
                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <p className="text-gray-700">Platform Fee</p>
                              </div>
                              <p className="text-sm text-gray-500">
                                10% of the listed price
                              </p>
                            </div>
                            <span className="text-gray-900 font-medium">
                              - ₹{commissionFee.toLocaleString()}
                            </span>
                          </div>

                          <div className="flex justify-between items-start">
                            <div className="space-y-1">
                              <p className="text-gray-700">
                                Amount received by the Owner
                              </p>
                              <p className="text-sm text-gray-500">
                                {/* ₹{warehouse.pricePerDay.toLocaleString()} ×{" "}
                                {calculateDays(startDate, endDate)} days */}
                                after all deductions
                              </p>
                            </div>
                            <span className="text-gray-900 font-medium">
                              ₹{(basePrice - commissionFee).toLocaleString()}
                            </span>
                          </div>

                          {/* Total */}
                          <div className="border-t border-dashed border-gray-200 pt-4 mt-4">
                            <div className="flex justify-between items-center">
                              <span className="text-lg font-semibold text-gray-900">
                                Total Payable
                              </span>
                              <span className="text-lg font-semibold text-gray-900">
                                ₹{basePrice.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Book Now Button */}
                        {/* <button className="w-full mt-6 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">
                        Book Now
                      </button> */}

                        {/* Cancellation Policy */}
                        {/* <p className="mt-4 text-sm text-gray-500 text-center">
                        Free cancellation before{" "}
                        {format(startDate, "MMM dd, yyyy")}
                      </p> */}
                      </div>
                    )}

                    <button
                      onClick={handleBooking}
                      className="w-full bg-emerald-600 text-white py-3 rounded-lg text-lg font-medium hover:bg-emerald-700 transition-colors duration-200"
                    >
                      Book Now
                    </button>

                    <div className="flex items-start space-x-3 pt-4">
                      <MapPin className="h-6 w-6 text-gray-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {warehouse.location.formattedAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="w-full lg:w-1/2 h-[400px] lg:h-auto">
                <MapContainer
                  center={warehouse.location.coordinates.slice().reverse()}
                  zoom={13}
                  style={{ height: "100%", width: "100%" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker
                    position={warehouse.location.coordinates.slice().reverse()}
                  >
                    <Popup>
                      <div className="text-sm">
                        <p className="font-semibold">{warehouse.name}</p>
                        <p>{warehouse.location.address}</p>
                      </div>
                    </Popup>
                  </Marker>
                </MapContainer>
              </div>
            </div>
          </div>
        </div>
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export default BookWarehouse;
