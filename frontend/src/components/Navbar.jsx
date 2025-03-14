import { useEffect, useState, useRef } from "react";
import {
  Leaf,
  Menu,
  X,
  LogOut,
  Bell,
  Settings,
  LayoutDashboardIcon,
  UploadIcon,
  SearchIcon,
  WarehouseIcon,
  Heart,
  User2Icon,
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
  const [hasPendingPayments, setHasPendingPayments] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Only prevent scroll when showing full-screen menu for logged-in users
    if (user) {
      document.body.style.overflow = !isMenuOpen ? "hidden" : "unset";
    }
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
    fetchPendingPayments();
  }, [userId, API_BASE_URL]); // Added API_BASE_URL to dependencies

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

  async function fetchPendingPayments() {
    try {
      if (userId) {
        const response = await fetch(
          `${API_BASE_URL}/bookings/pending-payments/${userId}`
        );
        if (!response.ok) {
          // console.log("Something went wrong.");
          return;
        }
        const data = await response.json();
        if (data.bookings.length > 0) {
          setHasPendingPayments(true);
        }
      }

      // console.log(data);
    } catch (error) {}
  }

  const ProfileDropdown = () => (
    <div ref={profileDropdownRef} className="relative">
      <button
        onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
        className={`flex items-center space-x-2 focus:outline-none ${
          hasUnread || hasPendingPayments ? "profile-pic green-dot" : ""
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
                  Dashboard
                </a>
                <a
                  href="/warehouses/search"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <SearchIcon className="w-4 h-4 mr-2" />
                  Explore
                </a>
                <a
                  href="/bookings"
                  className={`flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 ${
                    hasPendingPayments
                      ? "relative dropdown-payment green-dot"
                      : ""
                  }`}
                >
                  <WarehouseIcon className="w-4 h-4 mr-2" />
                  Bookings
                </a>
              </>
            ) : user.role === "owner" ? (
              <>
                <a
                  href="/owner/dashboard"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <LayoutDashboardIcon className="w-4 h-4 mr-2" />
                  Dashboard
                </a>
                <a
                  href="/listings"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <UploadIcon className="w-4 h-4 mr-2" />
                  Listings
                </a>
                <a
                  href="/warehouses/search"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <SearchIcon className="w-4 h-4 mr-2" />
                  Discover
                </a>
                <a
                  href="/customers"
                  className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                >
                  <User2Icon className="w-4 h-4 mr-2" />
                  Customers
                </a>
              </>
            ) : null}
            {user.role !== "admin" && user.role !== "anonymous" && (
              <>
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
                    hasUnread ? "relative dropdown-unread green-dot" : ""
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
              </>
            )}
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
    if (userId) {
      const eventSource = new EventSource(
        `${API_BASE_URL}/notifications/unread/${userId}`
      );

      eventSource.onmessage = (event) => {
        const newNotifications = JSON.parse(event.data);
        setHasUnread(true);
      };

      return () => eventSource.close();
    }
  }, [userId, API_BASE_URL]); // Added API_BASE_URL to dependencies

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
                Dashboard
              </a>
              <a
                href="/warehouses/search"
                className="text-md font-medium text-gray-700 hover:text-emerald-600 transition-colors"
              >
                Explore
              </a>
              <a
                href="/bookings"
                className="text-md font-medium text-gray-700 hover:text-emerald-600 transition-colors"
              >
                Bookings
              </a>
            </>
          )}
          {user?.role === "owner" && (
            <>
              <a
                href="/owner/dashboard"
                className="text-md font-medium text-gray-700 hover:text-emerald-600 transition-colors"
              >
                Dashboard
              </a>
              <a
                href="/warehouses/search"
                className="text-md font-medium text-gray-700 hover:text-emerald-600 transition-colors"
              >
                Discover
              </a>
              <a
                href="/listings"
                className="text-md font-medium text-gray-700 hover:text-emerald-600 transition-colors"
              >
                Listings
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
              <button
                onClick={handleGoogleCallback}
                className="flex items-center border border-gray-300 rounded-lg shadow-md px-6 py-2 text-sm font-medium hover:bg-gray-100"
              >
                <svg
                  className="h-6 w-6 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
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
                    strokeWidth="1"
                    fill="none"
                    fillRule="evenodd"
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
          className={`md:hidden p-2 rounded-full hover:bg-gray-100 transition-colors ${
            hasUnread || hasPendingPayments
              ? "profile-pic green-dot-mobile"
              : ""
          } `}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? (
            <X className="h-5 w-5 text-gray-600" />
          ) : user ? (
            <div className="relative">
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.name[0].toUpperCase()}
                className="w-8 h-8 rounded-full object-cover"
              />
            </div>
          ) : (
            <Menu className="h-5 w-5 text-gray-600" />
          )}
        </button>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <>
            {user ? (
              // Full-screen menu for logged-in users
              <div className="fixed inset-0 z-50 bg-white md:hidden">
                <div className="flex flex-col h-full">
                  {/* Header */}
                  <div className="flex items-center justify-between p-4 border-b">
                    <a
                      href="/"
                      className="flex items-center"
                      onClick={toggleMenu}
                    >
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

                  {/* User Profile */}
                  <div className="p-4 border-b">
                    <a
                      href={`/users/${
                        user.role === "farmer" ? "f" : "o"
                      }/show/${user._id}`}
                    >
                      <div className="flex items-center space-x-3">
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
                  </div>

                  {/* Navigation */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {user.role === "farmer" ? (
                      <>
                        <a
                          href="/farmer/dashboard"
                          className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                          onClick={toggleMenu}
                        >
                          <LayoutDashboardIcon className="w-5 h-5" />
                          <span>Dashboard</span>
                        </a>
                        <a
                          href="/warehouses/search"
                          className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                          onClick={toggleMenu}
                        >
                          <SearchIcon className="w-5 h-5" />
                          <span>Explore</span>
                        </a>
                        <a
                          href="/bookings"
                          className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                          onClick={toggleMenu}
                        >
                          <WarehouseIcon className="w-5 h-5" />
                          <span>Bookings</span>
                          {hasPendingPayments && (
                            <span className="w-2 h-2 bg-emerald-700 rounded-full ml-auto" />
                          )}
                        </a>
                      </>
                    ) : user.role !== "admin" && user.role !== "anonymous" ? (
                      <>
                        <a
                          href="/owner/dashboard"
                          className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                          onClick={toggleMenu}
                        >
                          <LayoutDashboardIcon className="w-5 h-5" />
                          <span>Dashboard</span>
                        </a>
                        <a
                          href="/listings"
                          className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                          onClick={toggleMenu}
                        >
                          <UploadIcon className="w-5 h-5" />
                          <span>Listings</span>
                        </a>
                        <a
                          href="/warehouses/search"
                          className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                          onClick={toggleMenu}
                        >
                          <SearchIcon className="w-5 h-5" />
                          <span>Discover</span>
                        </a>
                        <a
                          href="/warehouses/search"
                          className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                          onClick={toggleMenu}
                        >
                          <User2Icon className="w-5 h-5" />
                          <span>Customers</span>
                        </a>
                      </>
                    ) : (
                      ""
                    )}
                    {user.role !== "admin" && user.role !== "anonymous" && (
                      <>
                        <a
                          href="/wishlists"
                          className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                          onClick={toggleMenu}
                        >
                          <Heart className="w-5 h-5" />
                          <span>Wishlists</span>
                        </a>
                        <a
                          href="/notifications"
                          className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                          onClick={toggleMenu}
                        >
                          <Bell className="w-5 h-5" />
                          <span>Notifications</span>
                          {hasUnread && (
                            <span className="w-2 h-2 bg-emerald-700 rounded-full ml-auto" />
                          )}
                        </a>
                        <a
                          href="/settings"
                          className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                          onClick={toggleMenu}
                        >
                          <Settings className="w-5 h-5" />
                          <span>Settings</span>
                        </a>
                      </>
                    )}
                  </div>

                  {/* Logout Button */}
                  <div className="border-t p-4">
                    <button
                      onClick={() => {
                        toggleMenu();
                        setIsLogoutModalOpen(true);
                      }}
                      className="flex items-center space-x-3 p-2 text-gray-700 hover:bg-gray-100 rounded-lg w-full"
                    >
                      <LogOut className="w-5 h-5" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Dropdown menu for non-logged-in users
              <div className="absolute top-16 right-0 w-[100%] bg-white shadow-b-lg overflow-hidden md:hidden z-50">
                <div className="p-4 space-y-4">
                  <button
                    onClick={handleGoogleCallback}
                    className="flex items-center justify-center w-full border border-gray-300 rounded-lg shadow-sm px-4 py-2 text-sm font-medium hover:bg-gray-50"
                  >
                    <svg className="h-5 w-5 mr-2" viewBox="0 0 48 48">
                      <path
                        fill="#EA4335"
                        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
                      />
                      <path
                        fill="#4285F4"
                        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"
                      />
                      <path
                        fill="#34A853"
                        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
                      />
                    </svg>
                    Continue with Google
                  </button>
                  <div className="flex items-center">
                    <div className="flex-1 border-t"></div>
                    <span className="px-4 text-sm text-gray-500">or</span>
                    <div className="flex-1 border-t"></div>
                  </div>
                  <div className="space-y-2">
                    <a
                      href="/signin"
                      className="block w-full text-center py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={toggleMenu}
                    >
                      Sign in
                    </a>
                    <a
                      href="/signup"
                      className="block w-full text-center py-2 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                      onClick={toggleMenu}
                    >
                      Sign up
                    </a>
                  </div>
                </div>
              </div>
            )}
          </>
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
