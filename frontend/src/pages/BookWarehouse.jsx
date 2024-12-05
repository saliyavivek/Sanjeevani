import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { MapPin } from "lucide-react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import TextField from "@mui/material/TextField";
import "leaflet/dist/leaflet.css";
import { useLocation, useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";

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
  // console.log(warehouse);

  if (!warehouse) {
    navigate(-1);
    return;
  }

  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
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

  const updateTotalPrice = (start, end) => {
    const days = calculateDays(start, end);
    setTotalPrice(days * warehouse.pricePerDay);
  };

  const handleStartDateChange = (newValue) => {
    setStartDate(newValue);
    updateTotalPrice(newValue, endDate);
  };

  const handleEndDateChange = (newValue) => {
    setEndDate(newValue);
    updateTotalPrice(startDate, newValue);
  };

  const handleBooking = async () => {
    try {
      if (!startDate || !endDate) {
        alert("Please select both start and end dates");
        return;
      }

      const response = await fetch("http://localhost:8080/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          warehouseId: warehouse._id,
          userId,
          startDate,
          endDate,
          totalPrice,
        }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data.message, data.booking);
        navigate(`/booking/${data.booking._id}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <div className="min-h-screen bg-white">
          <div className="max-w-[2000px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen">
              {/* Booking Form Section */}
              <div className="p-12 lg:p-24 flex items-center">
                <div className="w-full max-w-lg">
                  <div className="mb-8">
                    <h1 className="text-[48px] font-bold text-gray-900 tracking-tight">
                      ₹{warehouse.pricePerDay.toLocaleString()}
                    </h1>
                    <p className="text-xl text-gray-600 mt-1">per day</p>
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

                    {totalPrice > 0 && (
                      <div className="space-y-3 pt-4">
                        <div className="flex justify-between items-center text-lg">
                          <span className="text-gray-600">
                            ₹{warehouse.pricePerDay.toLocaleString()} ×{" "}
                            {calculateDays(startDate, endDate)} days
                          </span>
                          <span className="text-gray-900 font-medium">
                            ₹{totalPrice.toLocaleString()}
                          </span>
                        </div>
                        <div className="border-t border-gray-200 pt-4">
                          <div className="flex justify-between items-center text-xl font-semibold">
                            <span>Total</span>
                            <span>₹{totalPrice.toLocaleString()}</span>
                          </div>
                        </div>
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
                      <p className="text-gray-600 leading-relaxed">
                        {warehouse.location.formattedAddress}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map Section */}
              <div className="h-[600px] lg:h-auto">
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
