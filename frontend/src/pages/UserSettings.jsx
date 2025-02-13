import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  User,
  ChevronRight,
  X,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import {
  showSuccessToast,
  showErrorToast,
  showLoadingToast,
} from "../components/toast";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import DeleteAccountModal from "../components/DeleteAccountModal";

const UserSettings = () => {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState({
    name: "",
    email: "",
    phoneno: "",
    about: "",
  });
  const [editMode, setEditMode] = useState({
    name: false,
    email: false,
    phoneno: false,
    password: false,
    about: false,
  });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserId = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const decodedToken = await jwtDecode(token); // If jwtDecode is async
          // console.log(decodedToken);
          setUserId(decodedToken.userId);
        } catch (error) {
          console.error("Invalid token", error);
          localStorage.removeItem("token");
        }
      }
    };

    fetchUserId();
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
        setUser(data);
        // console.log(user);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserDetails();
  }, [userId]);

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    // console.log(file);

    if (file) {
      try {
        setLoading(true);
        const loadingToastId = showLoadingToast(
          "Updating your profile picture..."
        );

        // Prepare FormData to send the file
        const formData = new FormData();
        formData.append("avatar", file);

        // API request to upload the profile picture
        const response = await fetch(
          `http://localhost:8080/api/users/${userId}/avatar`,
          {
            method: "PUT",
            body: formData,
          }
        );

        if (!response.ok) {
          throw new Error("Failed to upload profile picture");
        }

        const { avatarUrl } = await response.json();

        // Update user's avatar locally
        setUser((prev) => ({ ...prev, avatar: avatarUrl }));

        // Show success toast
        showSuccessToast(
          "Your profile picture has been updated",
          loadingToastId
        );
      } catch (error) {
        console.error("Error uploading profile picture:", error);
        showErrorToast("Failed to update profile picture", loadingToastId);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSave = async (field, value) => {
    try {
      setLoading(true);

      // Send only the updated field to the backend
      const updatedField = { [field]: value };

      const response = await fetch(
        `http://localhost:8080/api/users/${userId}`,
        {
          method: "PATCH", // PATCH is ideal for partial updates
          body: JSON.stringify(updatedField),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update user details.");
      }

      // Update the local state with the new data
      const updatedUser = await response.json();
      setUser((prev) => ({ ...prev, ...updatedUser }));

      // Disable the edit mode for the field
      setEditMode((prev) => ({ ...prev, [field]: false }));

      // Show success toast
      if (field === "phoneno") {
        showSuccessToast("Your phone number has been updated");
      } else if (field === "name") {
        showSuccessToast("Your name has been updated");
      } else if (field === "email") {
        showSuccessToast("Your email has been updated");
      } else if (field === "about") {
        showSuccessToast("Your about section has been updated");
      }
    } catch (error) {
      console.error("Error updating user details:", error);
      showErrorToast(`Failed to update ${field}`);
    } finally {
      setLoading(false);
    }
  };

  const InputField = ({ label, value, field, type = "text" }) => (
    <div className="py-4 border-b border-gray-200">
      {editMode[field] ? (
        <>
          <div className="flex justify-between items-center">
            <p className="text-base font-medium text-gray-900">{label}</p>
            <button
              onClick={() =>
                setEditMode((prev) => ({ ...prev, [field]: false }))
              }
              className="text-sm text-gray-900 hover:underline"
            >
              Cancel
            </button>
          </div>
          <input
            type={type}
            defaultValue={value}
            className="w-full px-3 py-2 mb-4 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-base"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSave(field, e.target.value);
              }
            }}
          />
          <button
            onClick={() =>
              handleSave(
                field,
                document.querySelector(`input[type="${type}"]`).value
              )
            }
            disabled={loading}
            className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 text-base font-medium"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save"}
          </button>
        </>
      ) : (
        <div className="flex justify-between items-center">
          <div>
            <p className="text-base font-medium text-gray-900">{label}</p>
            <p className="text-base text-gray-500">{value}</p>
          </div>
          <button
            onClick={() => setEditMode((prev) => ({ ...prev, [field]: true }))}
            className="text-sm text-gray-900 hover:underline self-start"
          >
            Edit
          </button>
        </div>
      )}
    </div>
  );

  const handleDeleteAccount = async () => {
    // console.log("deleting account of", userId);
    setIsDeleteModalOpen(false);

    try {
      const response = await fetch(
        "http://localhost:8080/api/users/delete-account",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
          }),
        }
      );
      if (!response.ok) {
        console.log("Error while deleting the user.");
        return;
      }

      const data = await response.json();
      // console.log(data);

      // alert(data.message);
      localStorage.removeItem("token");
      showSuccessToast(data.message);
      navigate("/signin");
    } catch (error) {
      console.error(error);
      alert("Failed to delete account. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-center gap-2 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="md:p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-3xl font-semibold text-gray-900">
            Personal info
          </h1>
        </div>

        <div className="mb-8">
          <div className="flex items-center">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-100">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <User className="w-16 h-16 text-gray-400" />
                  </div>
                )}
              </div>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={loading}
                className="absolute bottom-0 right-0 p-2 rounded-full bg-white border border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <Camera className="w-5 h-5 text-gray-600" />
              </button>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
            </div>
            <div className="ml-6">
              <h2 className="text-xl font-semibold text-gray-900">
                {user.name}
              </h2>
              <p className="text-base text-gray-600">{user.email}</p>
            </div>
          </div>
        </div>

        <div>
          <InputField label="Legal name" value={user.name} field="name" />
          <InputField
            label="Email address"
            value={user.email}
            field="email"
            type="email"
          />
          <InputField
            label="Phone"
            value={user.phoneno}
            field="phoneno"
            type="tel"
          />
          {/* Add About Me section */}
          <div className="py-4 border-b border-gray-200">
            {editMode.about || !user.about ? (
              <>
                <div className="flex justify-between items-center">
                  <p className="text-base font-medium text-gray-900">About</p>
                  {user.about && (
                    <button
                      onClick={() =>
                        setEditMode((prev) => ({ ...prev, about: false }))
                      }
                      className="text-sm text-gray-900 hover:underline"
                    >
                      Cancel
                    </button>
                  )}
                </div>
                <textarea
                  defaultValue={user.about}
                  placeholder="Tell us about yourself..."
                  className="w-full px-3 py-2 mb-4 mt-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 text-base min-h-[100px] resize-none"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.metaKey) {
                      handleSave("about", e.target.value);
                    }
                  }}
                />
                <button
                  onClick={() =>
                    handleSave(
                      "about",
                      document.querySelector("textarea").value
                    )
                  }
                  disabled={loading}
                  className="px-6 py-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 text-base font-medium"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Save"
                  )}
                </button>
              </>
            ) : (
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-base font-medium text-gray-900">About</p>
                  <p className="text-base text-gray-500 whitespace-pre-wrap">
                    {user.about}
                  </p>
                </div>
                <button
                  onClick={() =>
                    setEditMode((prev) => ({ ...prev, about: true }))
                  }
                  className="text-sm text-gray-900 hover:underline self-start"
                >
                  Edit
                </button>
              </div>
            )}
          </div>
          <div className="py-4">
            <a
              onClick={() => setIsDeleteModalOpen(true)}
              className="text-red-600 hover:bg-red-100 rounded p-2 cursor-pointer"
            >
              Delete account
            </a>
            {/* <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Delete Account
            </button> */}

            <DeleteAccountModal
              isOpen={isDeleteModalOpen}
              onClose={() => setIsDeleteModalOpen(false)}
              onConfirmDelete={handleDeleteAccount}
            />
          </div>
          {/* <InputField
            label="Password"
            value="••••••••"
            field="password"
            type="password"
          /> */}
        </div>
      </div>
    </div>
  );
};

export default UserSettings;
