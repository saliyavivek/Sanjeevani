import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Leaf,
  ArrowRight,
  Mail,
  Lock,
  User,
  Phone,
  Camera,
  MapPin,
} from "lucide-react";
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "../components/toast";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [phno, setPhno] = useState("");
  const [role, setRole] = useState("farmer");
  const [profilePicture, setProfilePicture] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToastId = showLoadingToast("Registering the user...");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("address", address);
    formData.append("phoneno", phno);
    formData.append("role", role);
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    } else {
      showErrorToast("Please upload your profile picture.", loadingToastId);
      return;
    }

    const response = await fetch("http://localhost:8080/api/users/signup", {
      method: "POST",
      body: formData,
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", JSON.stringify(data.token));

      showSuccessToast(data.message, loadingToastId);

      if (data.role === "farmer") {
        navigate("/warehouses/search");
      } else {
        navigate("/owner/dashboard");
      }
    } else {
      const error = await response.json();
      showErrorToast(error.message, loadingToastId);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-8 py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-emerald-900">
              Create an account
            </h1>
            <p className="mt-2 text-sm text-emerald-600">
              Join Sanjeevani and start managing your crop storage
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center flex-col items-center gap-2">
              <div className="relative w-32 h-32 rounded-full overflow-hidden bg-gray-200 cursor-pointer group">
                {profilePicture ? (
                  <img
                    src={URL.createObjectURL(profilePicture)}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center w-full h-full">
                    <User
                      className="h-16 w-16 text-gray-400"
                      aria-hidden="true"
                    />
                  </div>
                )}
                <div
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  onClick={() => fileInputRef.current.click()}
                >
                  <Camera className="h-8 w-8 text-white" aria-hidden="true" />
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <p className="block text-sm font-medium text-gray-700">
                Choose a profile picture
              </p>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Full Name
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="name"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="John Doe"
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="you@example.com"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="••••••••"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <input
                  id="address"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="State, Country"
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  required
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm"
                  placeholder="+91 987654321"
                  onChange={(e) => setPhno(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <span className="block text-sm font-medium text-gray-700">
                I am a
              </span>
              <div className="flex space-x-4">
                <div className="flex gap-4">
                  <label className="flex items-center gap-1 form-check">
                    <input
                      type="radio"
                      className="form-check-input form-radio text-emerald-600 focus:ring-emerald-500"
                      name="role"
                      value="farmer"
                      checked={role === "farmer"}
                      onChange={(e) => setRole(e.target.value)}
                    />
                    <span className="form-check-label text-md font-medium text-gray-700">
                      Farmer
                    </span>
                  </label>
                  <label className="flex items-center gap-1 form-check">
                    <input
                      type="radio"
                      className="form-check-input form-radio text-emerald-600 focus:ring-emerald-500"
                      name="role"
                      value="owner"
                      checked={role === "owner"}
                      onChange={(e) => setRole(e.target.value)}
                      style={{ accentColor: "#3b82f6" }}
                    />
                    <span className="form-check-label text-md font-medium text-gray-700">
                      Warehouse Owner
                    </span>
                  </label>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out"
            >
              Create Account
              <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{" "}
            <a
              href="/signin"
              className="font-medium text-emerald-600 hover:text-emerald-500"
            >
              Sign in
            </a>
          </p>

          <p className="mt-6 text-center text-xs text-gray-500">
            By signing up, you agree to our{" "}
            <a href="#" className="text-emerald-600 hover:underline">
              Terms & Conditions
            </a>{" "}
            and{" "}
            <a href="#" className="text-emerald-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-emerald-600 items-center justify-center">
        <div className="text-center text-white">
          <Leaf className="mx-auto h-16 w-16 mb-4" aria-hidden="true" />
          <h2 className="text-4xl font-bold">Sanjeevani</h2>
          <p className="mt-2 text-lg text-emerald-100">
            Connecting farmers with secure crop storage
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
