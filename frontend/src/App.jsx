import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import FarmerDashboard from "./pages/FarmerDashboard";
import Navbar from "./components/Navbar";
import WarehouseOwnerDashboard from "./pages/WarehouseOwnerDashboard";
import AddNewListing from "./pages/AddNewListing";
import BrowseStorage from "./pages/BrowseStorage";
import StorageDetail from "./pages/StorageDetail";
import Listings from "./pages/Listings";
import LandingPage from "./pages/LandingPage";
import { useLocation } from "react-router-dom";
import BookWarehouse from "./pages/BookWarehouse";
import MyBookings from "./pages/MyBookings";
import BookingDetails from "./pages/BookingDetails";
import { Toaster } from "sonner";
import { ToastContainer } from "./components/toast";
// import BookingRequests from "./pages/BookingRequests";
import UserSettings from "./pages/UserSettings";
import NotificationsPage from "./pages/NotificationsPage";
import ResetPassword from "./pages/ResetPassword";
import "./App.css";
import HostProfile from "./pages/HostProfile";
import FarmerProfile from "./pages/FarmerProfile";
import Wishlists from "./pages/WishLists";
import GoogleRedirect from "./pages/GoogleRedirect";
import AdminDashboard from "./pages/AdminDashboard";
import BookingRequests from "./pages/BookingRequests";
import Maintenance from "./pages/Maintenance";
import AdminEditPage from "./pages/AdminEditPage";
import DeactivationPage from "./pages/DeactivationPage";
import RoleSelectionPage from "./pages/RoleSelectionPage";
import MyCustomers from "./pages/MyCustomers";
import useAuth from "./hooks/useAuth";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import ResetCodePage from "./pages/ResetCodePage";

const AppRoutes = () => {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const { isDeactivated } = jwtDecode(token);
      if (isDeactivated && location.pathname !== "/deactivated") {
        navigate("/deactivated");
      }
    }
  }, [token]);

  return (
    <>
      {/* Conditionally render Navbar based on the current path */}
      {location.pathname !== "/" && location.pathname !== "/deactivated" && (
        <Navbar />
      )}
      <Routes>
        {/* <Route path="*" element={<Maintenance />} /> */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/owner/dashboard" element={<WarehouseOwnerDashboard />} />
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/warehouse/:id" element={<StorageDetail />} />
        <Route path="/warehouse/list" element={<AddNewListing />} />
        <Route path="/warehouses/search" element={<BrowseStorage />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/book/warehouse" element={<BookWarehouse />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/booking/:id" element={<BookingDetails />} />
        <Route path="/settings" element={<UserSettings />} />
        <Route path="/notifications" element={<NotificationsPage />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/users/o/show/:id" element={<HostProfile />} />
        <Route path="/users/f/show/:id" element={<FarmerProfile />} />
        <Route path="/wishlists" element={<Wishlists />} />
        <Route path="/auth" element={<GoogleRedirect />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/bookings/requests" element={<BookingRequests />} />
        <Route path="/admin/edit/:id" element={<AdminEditPage />} />
        <Route path="/deactivated" element={<DeactivationPage />} />
        <Route path="/select-role" element={<RoleSelectionPage />} />
        <Route path="/customers" element={<MyCustomers />} />
        <Route path="/reset-code" element={<ResetCodePage />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
