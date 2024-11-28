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

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/warehouses/search" element={<BrowseStorage />} />
        <Route path="/owner/dashboard" element={<WarehouseOwnerDashboard />} />
        <Route path="/farmer/dashboard" element={<FarmerDashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/warehouse/list" element={<AddNewListing />} />
        <Route path="/warehouse/:id" element={<StorageDetail />} />
        <Route path="/listings" element={<Listings />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
