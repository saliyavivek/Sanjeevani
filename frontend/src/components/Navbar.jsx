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
  Sun,
  Moon,
  Heart,
} from "lucide-react";
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";
import LogoutConfirmModal from "./LogoutConfirmModal";
import { showSuccessToast } from "./toast";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();
  const profileDropdownRef = useRef(null);
  const [hasUnread, setHasUnread] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent body scroll when mobile menu is open
    document.body.style.overflow = !isMenuOpen ? "hidden" : "unset";
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        setUserId(decodedToken.userId);
        // console.log("userid", userId);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const fetchUserDetails = async () => {
    try {
      if (userId) {
        const response = await fetch(`${API_BASE_URL}/users`, {
          method: "POST",
          body: JSON.stringify({ userId }),
          headers: { "Content-Type": "application/json" },
        });
        if (!response.ok) {
          console.log("Something went wrong.");
          return;
        }
        const data = await response.json();
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
      setUser(null);
      setIsLogoutModalOpen(false);
      setIsProfileDropdownOpen(false);
      setIsMenuOpen(false);
      document.body.style.overflow = "unset";
      navigate("/");
      showSuccessToast("Logged out.");
    } catch (error) {
      console.error("Error during logout", error);
    }
  }

  const ProfileDropdown = () => (
    <div ref={profileDropdownRef} className="relative">
      <button
        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
        className={`flex items-center space-x-2 focus:outline-none ${
          hasUnread ? "profile-pic green-dot" : ""
        }`}
      >
        <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white text-lg font-semibold hover:shadow-lg transition-shadow">
          <img
            src={user.avatar || "/placeholder.svg"}
            alt={user.name[0].toUpperCase()}
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      </button>
      {isProfileDropdownOpen && (
        <div className="absolute right-0 mt-2 w-52 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-3 py-2">
            <a
              href={`/users/${user.role === "farmer" ? "f" : "o"}/show/${
                user._id
              }`}
            >
              <div className="flex items-center gap-2">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name[0].toUpperCase()}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-gray-500">{user.email}</p>
                </div>
              </div>
            </a>
          </div>

          <div className="py-1">
            {user.role === "farmer" ? (
              <>
                <a
                  href="/farmer/dashboard"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LayoutDashboardIcon className="w-4 h-4 mr-2" />
                  My Dashboard
                </a>
                <a
                  href="/warehouses/search"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <SearchIcon className="w-4 h-4 mr-2" />
                  Search Storage
                </a>
                <a
                  href="/bookings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <WarehouseIcon className="w-4 h-4 mr-2" />
                  My Bookings
                </a>
              </>
            ) : user.role === "owner" ? (
              <>
                <a
                  href="/owner/dashboard"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LayoutDashboardIcon className="w-4 h-4 mr-2" />
                  My Dashboard
                </a>
                <a
                  href="/listings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <UploadIcon className="w-4 h-4 mr-2" />
                  Manage Listings
                </a>
              </>
            ) : null}

            <a
              href="/wishlists"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Heart className="w-4 h-4 mr-2" />
              Wishlists
            </a>
            <a
              href="/notifications"
              className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                hasUnread ? "dropdown green-dot" : ""
              }`}
            >
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </a>
            <a
              href="/settings"
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </a>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );

  useEffect(() => {
    const eventSource = new EventSource(
      `${API_BASE_URL}/notifications/unread/${userId}`
    );

    eventSource.onmessage = (event) => {
      const newNotifications = JSON.parse(event.data);
      setHasUnread(true);
    };

    return () => eventSource.close();
  }, [userId]);

  const handleGoogleCallback = () => {
    window.location.href = `${API_BASE_URL}/auth/google`;
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo - Always visible */}
        <a href="/" className="flex items-center">
          <Leaf className="h-8 w-8 text-emerald-600" />
          <span className="ml-1 text-2xl font-bold text-emerald-700">
            Sanjeevani
          </span>
        </a>

        {/* Desktop Navigation - Hidden on mobile */}
        <nav className="hidden md:flex items-center space-x-6">
          {user?.role === "farmer" && (
            <>
              <a
                href="/farmer/dashboard"
                className="text-md font-medium text-gray-700 hover:text-emerald-600 transition-colors"
              >
                My Dashboard
              </a>
              <a
                href="/warehouses/search"
                className="text-md font-medium text-gray-700 hover:text-emerald-600 transition-colors"
              >
                Search Storage
              </a>
              <a
                href="/bookings"
                className="text-md font-medium text-gray-700 hover:text-emerald-600 transition-colors"
              >
                My Bookings
              </a>
            </>
          )}
          {user?.role === "owner" && (
            <>
              <a
                href="/owner/dashboard"
                className="text-md font-medium text-gray-700 hover:text-emerald-600 transition-colors"
              >
                My Dashboard
              </a>
              <a
                href="/listings"
                className="text-md font-medium text-gray-700 hover:text-emerald-600 transition-colors"
              >
                Manage Listings
              </a>
            </>
          )}
        </nav>

        {/* Desktop Auth/Profile - Hidden on mobile */}
        <div className="hidden md:flex items-center space-x-4">
          {user ? (
            <ProfileDropdown />
          ) : (
            <>
              {/* <a
                href="/signin"
                className="px-4 py-2 text-md font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
              >
                Sign in
              </a>
              <a
                href="/signup"
                className="px-4 py-2 text-md font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors"
              >
                Sign up
              </a> */}
              <button
                onClick={handleGoogleCallback}
                class="flex items-center border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium hover:bg-gray-100"
              >
                <svg
                  class="h-6 w-6 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlns:xlink="http://www.w3.org/1999/xlink"
                  width="800px"
                  height="800px"
                  viewBox="-0.5 0 48 48"
                  version="1.1"
                >
                  {" "}
                  <title>Google-color</title> <desc>Created with Sketch.</desc>{" "}
                  <defs> </defs>{" "}
                  <g
                    id="Icons"
                    stroke="none"
                    stroke-width="1"
                    fill="none"
                    fill-rule="evenodd"
                  >
                    {" "}
                    <g
                      id="Color-"
                      transform="translate(-401.000000, -860.000000)"
                    >
                      {" "}
                      <g
                        id="Google"
                        transform="translate(401.000000, 860.000000)"
                      >
                        {" "}
                        <path
                          d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                          id="Fill-1"
                          fill="#FBBC05"
                        >
                          {" "}
                        </path>{" "}
                        <path
                          d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                          id="Fill-2"
                          fill="#EB4335"
                        >
                          {" "}
                        </path>{" "}
                        <path
                          d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                          id="Fill-3"
                          fill="#34A853"
                        >
                          {" "}
                        </path>{" "}
                        <path
                          d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                          id="Fill-4"
                          fill="#4285F4"
                        >
                          {" "}
                        </path>{" "}
                      </g>{" "}
                    </g>{" "}
                  </g>{" "}
                </svg>
                <span>Continue with Google</span>
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button - Only visible on mobile */}
        <button
          onClick={toggleMenu}
          className={`md:hidden p-2 text-gray-700 hover:text-emerald-600 transition-colors ${
            hasUnread ? "profile-pic green-dot-mobile" : ""
          } `}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6" />
          ) : user ? (
            <img
              src={user.avatar || "/placeholder.svg"}
              alt={user.name[0].toUpperCase()}
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {/* Mobile Menu - Full screen overlay */}
        {isMenuOpen && (
          <div className="fixed inset-0 z-50 bg-white md:hidden">
            <div className="flex flex-col h-full">
              {/* Mobile Menu Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <a href="/" className="flex items-center" onClick={toggleMenu}>
                  <Leaf className="h-8 w-8 text-emerald-600" />
                  <span className="ml-1 text-2xl font-bold text-emerald-700">
                    Sanjeevani
                  </span>
                </a>
                <button
                  onClick={toggleMenu}
                  className="p-2 text-gray-700 hover:text-emerald-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Mobile Menu Content */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 space-y-4">
                  {user && (
                    <a
                      href={`/users/${
                        user.role === "farmer" ? "f" : "o"
                      }/show/${user._id}`}
                    >
                      <div className="flex items-center space-x-3 mb-6">
                        <img
                          src={user.avatar || "/placeholder.svg"}
                          alt={user.name[0].toUpperCase()}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    </a>
                  )}

                  {/* Role-based Navigation */}
                  {user?.role === "farmer" && (
                    <>
                      <a
                        href="/farmer/dashboard"
                        className="flex items-center space-x-2 text-lg text-gray-700 hover:text-emerald-600 transition-colors py-2"
                        onClick={toggleMenu}
                      >
                        <LayoutDashboardIcon className="w-5 h-5" />
                        <span>My Dashboard</span>
                      </a>
                      <a
                        href="/warehouses/search"
                        className="flex items-center space-x-2 text-lg text-gray-700 hover:text-emerald-600 transition-colors py-2"
                        onClick={toggleMenu}
                      >
                        <SearchIcon className="w-5 h-5" />
                        <span>Search Storage</span>
                      </a>
                      <a
                        href="/bookings"
                        className="flex items-center space-x-2 text-lg text-gray-700 hover:text-emerald-600 transition-colors py-2"
                        onClick={toggleMenu}
                      >
                        <WarehouseIcon className="w-5 h-5" />
                        <span>My Bookings</span>
                      </a>
                    </>
                  )}

                  {user?.role === "owner" && (
                    <>
                      <a
                        href="/owner/dashboard"
                        className="flex items-center space-x-2 text-lg text-gray-700 hover:text-emerald-600 transition-colors py-2"
                        onClick={toggleMenu}
                      >
                        <LayoutDashboardIcon className="w-5 h-5" />
                        <span>My Dashboard</span>
                      </a>
                      <a
                        href="/listings"
                        className="flex items-center space-x-2 text-lg text-gray-700 hover:text-emerald-600 transition-colors py-2"
                        onClick={toggleMenu}
                      >
                        <UploadIcon className="w-5 h-5" />
                        <span>Manage Listings</span>
                      </a>
                    </>
                  )}

                  {/* Common Navigation Items for Logged-in Users */}
                  {user && (
                    <>
                      <a
                        href="/wishlists"
                        className="flex items-center space-x-2 text-lg text-gray-700 hover:text-emerald-600 transition-colors py-2"
                        onClick={toggleMenu}
                      >
                        <Heart className="w-5 h-5" />
                        <span>Wishlists</span>
                      </a>
                      <a
                        href="/notifications"
                        className="flex items-center space-x-2 text-lg text-gray-700 hover:text-emerald-600 transition-colors py-2"
                        onClick={toggleMenu}
                      >
                        <Bell className="w-5 h-5" />
                        <span>Notifications</span>
                        {hasUnread && (
                          <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                        )}
                      </a>
                      <a
                        href="/settings"
                        className="flex items-center space-x-2 text-lg text-gray-700 hover:text-emerald-600 transition-colors py-2"
                        onClick={toggleMenu}
                      >
                        <Settings className="w-5 h-5" />
                        <span>Settings</span>
                      </a>
                    </>
                  )}
                </div>
              </div>

              {/* Mobile Menu Footer */}
              <div className="border-t p-4">
                {user ? (
                  <button
                    onClick={() => {
                      toggleMenu();
                      setIsLogoutModalOpen(true);
                    }}
                    className="flex items-center space-x-2 text-lg text-gray-700 hover:text-emerald-600 transition-colors w-full py-2"
                  >
                    <LogOut className="w-5 h-5" />
                    <span>Logout</span>
                  </button>
                ) : (
                  <div className="space-y-2">
                    <a
                      href="/signin"
                      className="block w-full text-center py-2 text-lg font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                      onClick={toggleMenu}
                    >
                      Sign in
                    </a>
                    <a
                      href="/signup"
                      className="block w-full text-center py-2 text-lg font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-md transition-colors"
                      onClick={toggleMenu}
                    >
                      Sign up
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </header>
  );
};

export default Navbar;
