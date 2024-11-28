import React, { useEffect, useState } from "react";
import { ArrowUpDown, Menu, X } from "lucide-react";
import { jwtDecode } from "jwt-decode";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [role, setRole] = useState("");

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        setRole(decodedToken.role);
      } catch (error) {
        console.error("Invalid token", error);
        // Optional: Clear invalid token
        localStorage.removeItem("token");
      }
    }
  }, []);

  function handleLogout() {
    try {
      localStorage.removeItem("token");
      setRole("");
    } catch (error) {
      console.error("Invalid token", error);
    }
  }

  return (
    <header className="border-b">
      <div className="max-w-[1400px] container mx-auto px-4 h-16 flex items-center justify-between backdrop-blur-md">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-2">
          <ArrowUpDown className="h-6 w-6 text-green-500" />
          <span className="font-bold text-xl">Sanjeevani</span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          {role === "farmer" && (
            <>
              <a
                href="/farmer/dashboard"
                className="text-md font-medium text-gray-700 hover:text-green-600 transition-colors"
              >
                My Dashboard
              </a>
              <a
                href="/warehouses/search"
                className="text-md font-medium text-gray-700 hover:text-green-600 transition-colors"
              >
                Search Storage
              </a>
              <a
                href="/bookings"
                className="text-md font-medium text-gray-700 hover:text-green-600 transition-colors"
              >
                My Bookings
              </a>
            </>
          )}
          {role === "owner" && (
            <>
              <a
                href="/owner/dashboard"
                className="text-md font-medium text-gray-700 hover:text-green-600 transition-colors"
              >
                My Dashboard
              </a>
              <a
                href="/listings"
                className="text-md font-medium text-gray-700 hover:text-green-600 transition-colors"
              >
                Manage Listings
              </a>
              <a
                href="/requests"
                className="text-md font-medium text-gray-700 hover:text-green-600 transition-colors"
              >
                Booking Requests
              </a>
            </>
          )}
        </nav>

        {/* Auth Buttons */}
        <div className="hidden lg:flex items-center space-x-4">
          {role ? (
            <>
              <a
                href=""
                className="px-4 py-2 text-md font-medium text-gray-700 transition-colors hover:bg-gray-100 rounded-md h-10"
                onClick={handleLogout}
              >
                Logout
              </a>
            </>
          ) : (
            <>
              <a
                href="/signin"
                className="px-4 py-2 text-md font-medium text-gray-700 transition-colors hover:bg-gray-100 rounded-md h-10"
              >
                Sign in
              </a>
              <a
                href="/signup"
                className="px-4 py-2 text-md font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors h-10"
              >
                Sign up
              </a>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={toggleMenu}
          className="lg:hidden p-2 text-gray-700 hover:text-green-600 transition-colors"
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 bg-white">
            <div className="flex flex-col space-y-4 p-4 bg-white">
              <button
                onClick={toggleMenu}
                className="self-end p-2 text-gray-700 hover:text-green-600 transition-colors"
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
              <a
                href="/search"
                className="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors"
              >
                Search Storage
              </a>
              <a
                href="/bookings"
                className="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors"
              >
                My Bookings
              </a>
              <a
                href="/listings"
                className="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors"
              >
                Manage Listings
              </a>
              <a
                href="/requests"
                className="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors"
              >
                Booking Requests
              </a>
              <hr className="my-4" />
              <a
                href="/signin"
                className="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors"
              >
                Sign in
              </a>
              <a
                href="/signup"
                className="px-4 py-2 text-lg font-medium text-white bg-green-600 hover:bg-green-700 rounded-md transition-colors text-center"
              >
                Sign up
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
