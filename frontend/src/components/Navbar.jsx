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
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  const fetchUserDetails = async () => {
    try {
      if (userId) {
        const response = await fetch("http://localhost:8080/api/users", {
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
            <div className="flex items-center gap-2">
              <img
                src={user.avatar || "/placeholder.svg"}
                alt={user.name[0].toUpperCase()}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-medium text-gray-700">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
            </div>
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
      `http://localhost:8080/api/notifications/unread/${userId}`
    );

    eventSource.onmessage = (event) => {
      const newNotifications = JSON.parse(event.data);
      setHasUnread(true);
    };

    return () => eventSource.close();
  }, [userId]);

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
              <a
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
              </a>
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
                    <div className="flex items-center space-x-3 mb-6">
                      <img
                        src={user.avatar || "/placeholder.svg"}
                        alt={user.name[0].toUpperCase()}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                      </div>
                    </div>
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
