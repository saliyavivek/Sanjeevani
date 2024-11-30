import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Leaf, ArrowRight, Mail, Lock, User, Phone } from "lucide-react";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phno, setPhno] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
        phoneno: phno,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", JSON.stringify(data.token));
      if (data.role === "farmer") {
        navigate("/warehouse/search");
      } else {
        navigate("/owner/dashboard");
      }
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
                  placeholder="+1 (555) 000-0000"
                  onChange={(e) => setPhno(e.target.value)}
                />
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
