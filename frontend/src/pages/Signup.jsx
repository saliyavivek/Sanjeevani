import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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
        navigate("/farmer");
      } else {
        navigate("/owner");
      }
      // console.log(data.message);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex w-full lg:w-1/2 flex-col justify-center px-8 py-12 bg-emerald-50">
        <div className="mx-auto w-full max-w-md">
          <div className="space-y-2 text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-emerald-900">
              Sign up
            </h1>
            <p className="text-gray-500">Create your account to get started</p>
            <p className="text-gray-500">
              Already have an account? <a href="/signin">Login</a>
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label htmlFor="name">Name</label>
              <input
                id="name"
                placeholder="Enter your name"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Create a password"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="Enter your phone number"
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded"
                onChange={(e) => setPhno(e.target.value)}
              />
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
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

      <div className="hidden lg:flex w-1/2 bg-white items-center justify-center">
        <div className="text-center">
          <div className="mb-8">{/* logo */}</div>
          <h2 className="text-4xl font-bold text-emerald-900">Sanjeevani</h2>
          <p className="mt-2 text-lg text-gray-600">
            Sign up or log in to your account.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
