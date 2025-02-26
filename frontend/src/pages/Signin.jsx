import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, ArrowRight, Mail, Lock } from "lucide-react";
import PasswordResetModal from "../components/PasswordResetModal";
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "../components/toast";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const loadingToastId = showLoadingToast("Logging in the user...");
    const response = await fetch(`${API_BASE_URL}/users/signin`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", JSON.stringify(data.token));

      showSuccessToast(data.message, loadingToastId);

      console.log(data);

      if (data.isDeactivated == true) {
        navigate("/deactivated");
        return;
      }

      if (data.role === "farmer") {
        navigate("/warehouses/search");
      } else {
        navigate("/owner/dashboard");
      }
    } else {
      const error = await response.json();
      showErrorToast(error.message, loadingToastId);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-8 py-12">
        <div className="mx-auto w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold tracking-tight text-emerald-900">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-emerald-600">
              Please sign in to your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsResetModalOpen(true)}
                  className="text-sm font-medium text-emerald-600 hover:text-emerald-500"
                >
                  Forgot password?
                </button>
              </div>
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition duration-150 ease-in-out"
            >
              {isLoading ? (
                "Signing In..."
              ) : (
                <>
                  Sign In
                  <ArrowRight className="ml-2 h-5 w-5" aria-hidden="true" />
                </>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <a
              href="/signup"
              className="font-medium text-emerald-600 hover:text-emerald-500"
            >
              Sign up
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

      <PasswordResetModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />
    </div>
  );
};

export default Signin;
