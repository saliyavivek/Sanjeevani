import React, { useEffect, useState } from "react";
import { UserX, Mail, Phone, AlertTriangle } from "lucide-react";
import LogoutConfirmModal from "../components/LogoutConfirmModal";
import { useNavigate } from "react-router-dom";
import { showSuccessToast } from "../components/toast";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";

const DeactivationPage = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [userName, setUserName] = useState(false);
  const navigate = useNavigate();
  const token = useAuth();

  useEffect(() => {
    // const storedToken = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserName(decodedToken.name);
        // console.log("userid", userId);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  function handleLogout() {
    try {
      localStorage.removeItem("token");
      setIsLogoutModalOpen(false);
      navigate("/");
      showSuccessToast("Logged out.");
    } catch (error) {
      console.error("Error during logout", error);
    }
  }

  const handleContactSupport = () => {
    const subject = `Account Activation Appeal`;
    const body = `Hello Sanjeevani Support Team,

I'm writing regarding my recently deactivated account.
Username: ${userName}

I'd like to inquire about the reason for deactivation and discuss the possibility of reactivating my account.

Thank you,
${userName}`;

    // Encode the subject and body for use in a mailto link
    const encodedSubject = encodeURIComponent(subject);
    const encodedBody = encodeURIComponent(body);

    // Open the user's email client with the pre-filled email
    window.location.href = `mailto:support@sanjeevani.com?subject=${encodedSubject}&body=${encodedBody}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
        <div className="text-center">
          {/* <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-gray-100 mb-6">
            <UserX size={32} className="text-gray-500" />
          </div>

          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Account Deactivated
          </h2>

          <p className="text-gray-600 mb-6">
            Your account has been deactivated by an administrator. If you
            believe this is an error, please contact our support team.
          </p>

          <div className="text-sm text-gray-500 mb-6 flex flex-col items-center space-y-2">
            <div className="flex items-center">
              <Mail size={16} className="mr-2" />
              <span>support@example.com</span>
            </div>
            <div className="flex items-center">
              <Phone size={16} className="mr-2" />
              <span>(123) 456-7890</span>
            </div>
          </div> */}

          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-50 mb-6">
            <UserX size={32} className="text-red-400" />
          </div>

          {/* Personalized Heading */}
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Hi {userName}, your account has been deactivated
          </h2>

          {/* Personalized Message */}
          <p className="text-gray-600 mb-4">
            We're sorry to inform you that your account has been deactivated by
            an administrator.
          </p>

          {/* Reason section */}
          <div className="bg-amber-50 p-4 rounded-md mb-6 flex items-start">
            <AlertTriangle
              size={20}
              className="text-amber-500 mr-2 mt-0.5 flex-shrink-0"
            />
            <p className="text-sm text-amber-700 text-left">
              This may have happened due to a violation of our terms of service
              or as requested by you. If you believe this is an error, please
              contact our support team using the information below.
            </p>
          </div>

          <div className="flex justify-between space-x-4">
            <button
              className="py-2 px-4 bg-red-50 text-red-600 hover:bg-red-100 font-medium rounded-md transition duration-150 ease-in-out"
              onClick={() => {
                setIsLogoutModalOpen(true);
              }}
            >
              Log out
            </button>
            <button
              className="py-2 px-4 bg-blue-50 text-blue-600 hover:bg-blue-100 font-medium rounded-md transition duration-150 ease-in-out"
              onClick={handleContactSupport}
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
      />
    </div>
  );
};

export default DeactivationPage;
