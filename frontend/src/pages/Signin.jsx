import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("farmer");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8080/api/users/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
        role,
      }),
    });
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", JSON.stringify(data.token));
      if (data.role === "farmer") {
        navigate("/warehouses/search");
      } else {
        navigate("/listings");
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
              Sign in
            </h1>
            <p className="text-gray-500">
              Log in to your account to get started
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
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
              Who are you? <br />
              <label>
                <input
                  type="radio"
                  name="role"
                  value="farmer"
                  required
                  checked={role === "farmer"}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-3 h-3 accent-green-500"
                />{" "}
                I am a Farmer
              </label>{" "}
              <label>
                <input
                  type="radio"
                  name="role"
                  value="owner"
                  required
                  checked={role === "owner"}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-3 h-3 accent-green-500"
                />{" "}
                I am a Warehouse Owner
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700"
            >
              Login
            </button>
          </form>
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

export default Signin;
