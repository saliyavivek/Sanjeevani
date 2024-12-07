import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Leaf,
  Search,
  Home,
  Star,
  ChevronRight,
  User,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const LandingPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsLoggedIn(true);
      const decodedToken = jwtDecode(storedToken);
      if (decodedToken.role === "owner") {
        setRole("owner");
      } else if (decodedToken.role === "farmer") {
        setRole("farmer");
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Leaf className="h-8 w-8 text-green-600" />
              <span className="ml-2 text-2xl font-bold text-green-800">
                Sanjeevani
              </span>
            </div>
            <div className="flex items-center">
              <a
                href="#how-it-works"
                className="text-gray-600 hover:text-green-600 px-3 py-2"
              >
                How It Works
              </a>
              <a
                href="#features"
                className="text-gray-600 hover:text-green-600 px-3 py-2"
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="text-gray-600 hover:text-green-600 px-3 py-2"
              >
                Testimonials
              </a>
              <a
                href={
                  !isLoggedIn
                    ? "/signup"
                    : role === "owner"
                    ? "/owner/dashboard"
                    : "/farmer/dashboard"
                }
                className="ml-4 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition duration-300 cursor-pointer"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-green-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:flex lg:items-center lg:justify-between">
            <div className="lg:w-1/2">
              <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                Secure Storage{" "}
                <span className="text-green-600">for Your Harvest</span>
              </h1>
              <p className="mt-3 max-w-md mx-auto text-lg text-gray-500 sm:text-xl md:mt-5 md:max-w-3xl">
                Sanjeevani connects farmers with safe, reliable storage
                solutions. Protect your crops and maximize your profits.
              </p>
              <div className="mt-10 sm:flex">
                <div className="rounded-md flex items-end">
                  <a
                    href={
                      !isLoggedIn
                        ? "/signup"
                        : role === "owner"
                        ? "/owner/dashboard"
                        : "/warehouses/search"
                    }
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 md:py-4 md:text-lg md:px-10"
                  >
                    Find Storage
                  </a>
                </div>
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a
                    href="#"
                    className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0 lg:w-1/2">
              <img
                className="rounded-lg shadow-xl h-400 w-600 object-cover"
                src="https://res.cloudinary.com/dqb07bzeu/image/upload/v1733070017/sanjeevani/9f12094d-f623-4ffa-8a0d-643c7f8c6334_acktn0_e_gen_remove_prompt__watermark_on_the_bottom_right_corner_multiple_true_m4onid.jpg"
                alt="Farmer in field"
              />
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              How Sanjeevani Works
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Three simple steps to secure storage for your crops
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                  <Search className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">
                  Search
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Find available storage spaces in your area with our
                  easy-to-use search tool.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                  <Home className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">Book</h3>
                <p className="mt-2 text-base text-gray-500">
                  Reserve your storage space with just a few clicks. It's that
                  simple.
                </p>
              </div>

              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                  <Leaf className="h-6 w-6" />
                </div>
                <h3 className="mt-6 text-lg font-medium text-gray-900">
                  Store
                </h3>
                <p className="mt-2 text-base text-gray-500">
                  Safely store your crops and enjoy peace of mind knowing
                  they're secure.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-base text-green-600 font-semibold tracking-wide uppercase">
              Features
            </h2>
            <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need to store with confidence
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              {[
                {
                  title: "Verified Storage Facilities",
                  description:
                    "All storage facilities on our platform are thoroughly vetted and verified for quality and security.",
                },
                {
                  title: "Flexible Booking Options",
                  description:
                    "Choose from a variety of storage durations to suit your needs, from short-term to long-term storage.",
                },
                {
                  title: "Real-time Availability",
                  description:
                    "Our platform provides up-to-date information on storage availability, so you can make informed decisions.",
                },
                {
                  title: "Secure Payments",
                  description:
                    "Our integrated payment system ensures your transactions are safe and secure.",
                },
              ].map((feature, index) => (
                <div key={index} className="relative">
                  <dt>
                    <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white">
                      <Star className="h-6 w-6" aria-hidden="true" />
                    </div>
                    <p className="ml-16 text-lg leading-6 font-medium text-gray-900">
                      {feature.title}
                    </p>
                  </dt>
                  <dd className="mt-2 ml-16 text-base text-gray-500">
                    {feature.description}
                  </dd>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              What Our Users Say
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
              Don't just take our word for it - hear from some of our satisfied
              users
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
              {[
                {
                  name: "Rajesh Kumar",
                  role: "Wheat Farmer",
                  image: "/placeholder.svg?height=100&width=100",
                  quote:
                    "Sanjeevani has been a game-changer for me. I no longer worry about where to store my harvest.",
                },
                {
                  name: "Priya Sharma",
                  role: "Rice Grower",
                  image: "/placeholder.svg?height=100&width=100",
                  quote:
                    "The ease of finding and booking storage has significantly reduced my post-harvest stress.",
                },
                {
                  name: "Amit Patel",
                  role: "Fruit Orchard Owner",
                  image: "/placeholder.svg?height=100&width=100",
                  quote:
                    "Thanks to Sanjeevani, I can now store my fruits in climate-controlled facilities, extending their shelf life.",
                },
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white shadow-lg rounded-lg px-5 py-6 sm:px-6"
                >
                  <div className="flex items-center space-x-4">
                    <User />
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {testimonial.name}
                      </h3>
                      <p className="text-gray-500">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-gray-600">"{testimonial.quote}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-green-600">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-green-200">
              Find the perfect storage for your crops today.
            </span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <a
                href={
                  !isLoggedIn
                    ? "/signup"
                    : role === "owner"
                    ? "/owner/dashboard"
                    : "/farmer/dashboard"
                }
                className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-green-600 bg-white hover:bg-green-50"
              >
                Get Started
                <ArrowRight className="ml-3 -mr-1 h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              &copy; 2024 Sanjeevani. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
