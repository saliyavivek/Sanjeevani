import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import BookingRequests from "./pages/BookingRequests";
import UserSettings from "./pages/UserSettings";

const AppRoutes = () => {
  const location = useLocation(); // Get the current location

  return (
    <>
      {/* Conditionally render Navbar based on the current path */}
      {location.pathname !== "/" && <Navbar />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/warehouses/search" element={<BrowseStorage />} />
        <Route path="/owner/dashboard" element={<WarehouseOwnerDashboard />} />
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/warehouse/list" element={<AddNewListing />} />
        <Route path="/warehouse/:id" element={<StorageDetail />} />
        <Route path="/listings" element={<Listings />} />
        <Route path="/book/warehouse" element={<BookWarehouse />} />
        <Route path="/bookings" element={<MyBookings />} />
        <Route path="/booking/:id" element={<BookingDetails />} />
        <Route path="/requests" element={<BookingRequests />} />
        <Route path="/settings" element={<UserSettings />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      {/* <Toaster
        position="bottom-center"
        toastOptions={{
          style: {
            fontSize: "16px",
            whiteSpace: "nowrap",
            width: "100%",
          },
        }}
      /> */}
      <ToastContainer />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
