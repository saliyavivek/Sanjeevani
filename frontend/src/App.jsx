import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";
import Signup from "./pages/Signup";
import FarmerDashboard from "./pages/FarmerDashboard";
import Navbar from "./components/Navbar";
import WarehouseOwnerDashboard from "./pages/WarehouseOwnerDashboard";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/owner" element={<WarehouseOwnerDashboard />} />
        <Route path="/farmer" element={<FarmerDashboard />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
