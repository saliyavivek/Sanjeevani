import React, { useEffect, useState, useRef } from "react";
import {
  Leaf,
  Menu,
  X,
  LogOut,
  Bell,
  User,
  Settings,
  LayoutDashboardIcon,
  UploadIcon,
  SearchIcon,
  WarehouseIcon,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutConfirmModal from "./LogoutConfirmModal";
import { showSuccessToast } from "./toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  // const [role, setRole] = useState("");
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        // setRole(decodedToken.role);
        setUserId(decodedToken.userId);

        // console.log(user);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const fetchUserDetails = async () => {
    try {
      // console.log(userId);
      if (userId) {
        const response = await fetch("http://localhost:8080/api/users", {
          method: "POST",
          body: JSON.stringify({
            userId,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        // console.log(response);
        if (!response.ok) {
          console.log("Something went wrong.");
          return;
        }
        const data = await response.json();
        // console.log(data);

        setUser(data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(event.target)
      ) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  function handleLogout() {
    try {
      localStorage.removeItem("token");
      // setRole("");
      setUser(null);
      setIsLogoutModalOpen(false);
      setIsProfileDropdownOpen(false);
      navigate("/"); // Redirect to home page after logout
      showSuccessToast("Logged out.");
    } catch (error) {
      console.error("Error during logout", error);
    }
  }

  const ProfileDropdown = () => (
    <div ref={profileDropdownRef} className="relative">
      <button
        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white text-lg font-semibold hover:shadow-lg">
          {/* {user?.name ? (
            user.name[0].toUpperCase()
          ) : (
            <User className="w-6 h-6" />
          )} */}
          <img
            src={user.avatar}
            alt={user.name[0].toUpperCase()}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      </button>
      {isProfileDropdownOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-[1050]">
          {user.role === "farmer" ? (
            <>
              <a
                href="/farmer/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LayoutDashboardIcon className="w-4 h-4 inline-block mr-2" />
                My Dashboard
              </a>
              <a
                href="/warehouses/search"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <SearchIcon className="w-4 h-4 inline-block mr-2" />
                Search Storage
              </a>
              <a
                href="/bookings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <WarehouseIcon className="w-4 h-4 inline-block mr-2" />
                My Bookings
              </a>
            </>
          ) : user.role === "owner" ? (
            <>
              <a
                href="/owner/dashboard"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <LayoutDashboardIcon className="w-4 h-4 inline-block mr-2" />
                My Dashboard
              </a>
              <a
                href="/listings"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                <UploadIcon className="w-4 h-4 inline-block mr-2" />
                Manage Listings
              </a>
              {/* <a
                href="/requests"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Booking Requests
              </a> */}
            </>
          ) : null}
          <a
            href="/notifications"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Bell className="w-4 h-4 inline-block mr-2" />
            Notifications
          </a>
          <a
            href="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <Settings className="w-4 h-4 inline-block mr-2" />
            Settings
          </a>
          <button
            onClick={() => setIsLogoutModalOpen(true)}
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4 inline-block mr-2" />
            Logout
          </button>
        </div>
      )}
    </div>
  );

  return (
    <header className="border-b z-[1000]">
      <div className="max-w-[1400px] container mx-auto px-4 h-16 flex items-center justify-between backdrop-blur-md">
        {/* Logo */}
        <a href="/" className="cursor-pointer">
          <div className="flex items-center">
            <Leaf className="h-8 w-8 text-emerald-600" />
            <span className="ml-1 text-2xl font-bold text-emerald-700">
              Sanjeevani
            </span>
          </div>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          {user?.role === "farmer" && (
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
          {user?.role === "owner" && (
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
            </>
          )}
        </nav>

        {/* Auth Buttons or Profile Dropdown */}
        <div className="hidden lg:flex items-center space-x-4">
          {user ? (
            <ProfileDropdown />
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
                className="px-4 py-2 text-md font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors h-10"
              >
                Sign up
              </a>
            </>
          )}
        </div>

        {/* Mobile View */}
        <div className="lg:hidden flex items-center">
          {user ? (
            <div onClick={() => setIsMenuOpen(true)} className="cursor-pointer">
              <img
                src={user.avatar}
                alt={user.name[0].toUpperCase()}
                className="w-10 h-10 rounded-full object-cover"
              />
            </div>
          ) : (
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-700 hover:text-green-600 transition-colors"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              <Menu className="h-6 w-6" />
            </button>
          )}
        </div>

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
              {user && (
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white text-lg font-semibold">
                    <img
                      src={user.avatar}
                      alt={user.name[0].toUpperCase()}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </div>
                  <span className="text-lg font-medium">{user.name}</span>
                </div>
              )}
              {user?.role === "farmer" && (
                <>
                  <a
                    href="/farmer/dashboard"
                    className="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors"
                  >
                    My Dashboard
                  </a>
                  <a
                    href="/warehouses/search"
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
                </>
              )}
              {user?.role === "owner" && (
                <>
                  <a
                    href="/owner/dashboard"
                    className="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors"
                  >
                    My Dashboard
                  </a>
                  <a
                    href="/listings"
                    className="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors"
                  >
                    Manage Listings
                  </a>
                </>
              )}
              {user && (
                <>
                  <a
                    href="/notifications"
                    className="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors flex items-center"
                  >
                    <Bell className="w-5 h-5 mr-2" />
                    Notifications
                  </a>
                  <a
                    href="/settings"
                    className="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors flex items-center"
                  >
                    <Settings className="w-5 h-5 mr-2" />
                    Settings
                  </a>
                </>
              )}
              <hr className="my-4" />
              {user ? (
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    setIsLogoutModalOpen(true);
                  }}
                  className="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors flex items-center"
                >
                  <LogOut className="w-5 h-5 mr-2" />
                  Logout
                </button>
              ) : (
                <>
                  <a
                    href="/signin"
                    className="text-lg font-medium text-gray-700 hover:text-green-600 transition-colors"
                  >
                    Sign in
                  </a>
                  <a
                    href="/signup"
                    className="px-4 py-2 text-lg font-medium text-white bg-emerald-600 hover:bg-green-700 rounded-md transition-colors text-center"
                  >
                    Sign up
                  </a>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirm Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </header>
  );
};

export default Navbar;
