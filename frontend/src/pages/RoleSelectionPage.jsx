import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TreesIcon as Plant, Warehouse, ChevronRight } from "lucide-react";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { showErrorToast } from "../components/toast";

const RoleSelectionPage = () => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const token = useAuth();

  useEffect(() => {
    if (token) {
      const { userId, role } = jwtDecode(token);

      if (role !== "anonymous") {
        return navigate(-1);
      }

      setUserId(userId);
    }
  }, [token]);

  const handleRoleSelection = (role) => {
    setSelectedRole(role);
  };

  const handleContinue = async () => {
    setAssigning(true);
    if (selectedRole) {
      const response = await fetch(
        `${API_BASE_URL}/users/${userId}/assign-role`,
        {
          method: "PUT",
          body: JSON.stringify({
            role: selectedRole,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        showErrorToast("Error while assiging role.");
        return;
      }

      if (selectedRole === "farmer") {
        return navigate("/warehouses/search");
      } else {
        return navigate("/owner/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Select your role
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Choose the role that best describes you
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="space-y-4">
            <button
              onClick={() => handleRoleSelection("farmer")}
              className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors ${
                selectedRole === "farmer"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-green-500"
              }`}
            >
              <div className="flex items-center">
                <Plant className="h-6 w-6 text-green-600 mr-3" />
                <span className="text-lg font-medium text-gray-900">
                  Farmer
                </span>
              </div>
              {selectedRole === "farmer" && (
                <ChevronRight className="h-5 w-5 text-green-600" />
              )}
            </button>

            <button
              onClick={() => handleRoleSelection("owner")}
              className={`w-full flex items-center justify-between p-4 border rounded-lg transition-colors ${
                selectedRole === "owner"
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300 hover:border-blue-500"
              }`}
            >
              <div className="flex items-center">
                <Warehouse className="h-6 w-6 text-blue-600 mr-3" />
                <span className="text-lg font-medium text-gray-900">Owner</span>
              </div>
              {selectedRole === "owner" && (
                <ChevronRight className="h-5 w-5 text-blue-600" />
              )}
            </button>
            <p className="text-sm text-gray-600 font-medium">
              Please select your role carefully. This choice{" "}
              <span className="font-bold">cannot</span> be modified later.
            </p>
          </div>
          <div className="mt-6">
            <button
              onClick={handleContinue}
              disabled={!selectedRole}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                selectedRole
                  ? "bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {assigning ? (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                <span>Book now</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
