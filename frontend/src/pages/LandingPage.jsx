import React, { useEffect, useState } from "react";
import {
  ArrowRight,
  Leaf,
  Search,
  Home,
  Star,
  ChevronRight,
  User,
  Menu,
  X,
  CircleArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const LandingPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
      } else if (decodedToken.role === "admin") {
        setRole("admin");
      }
    } else {
      setIsLoggedIn(false);
    }
  }, [navigate]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
            <div className="hidden md:flex items-center">
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
                    : role === "farmer"
                    ? "/farmer/dashboard"
                    : "/admin"
                }
                className="ml-4 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition duration-300 cursor-pointer"
              >
                Get Started
              </a>
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={toggleMenu}
                className="text-gray-600 hover:text-green-600 focus:outline-none focus:text-green-600"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a
                href="#how-it-works"
                className="block text-gray-600 hover:text-green-600 px-3 py-2"
                onClick={toggleMenu}
              >
                How It Works
              </a>
              <a
                href="#features"
                className="block text-gray-600 hover:text-green-600 px-3 py-2"
                onClick={toggleMenu}
              >
                Features
              </a>
              <a
                href="#testimonials"
                className="block text-gray-600 hover:text-green-600 px-3 py-2"
                onClick={toggleMenu}
              >
                Testimonials
              </a>
              <a
                href={
                  !isLoggedIn
                    ? "/signup"
                    : role === "owner"
                    ? "/owner/dashboard"
                    : role === "farmer"
                    ? "/farmer/dashboard"
                    : "/admin"
                }
                className="block px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 transition duration-300 cursor-pointer"
                onClick={toggleMenu}
              >
                Get Started
              </a>
            </div>
          </div>
        )}
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
                <div className="mt-3 sm:mt-0 sm:ml-3">
                  <a
                    href={
                      !isLoggedIn
                        ? "/signup"
                        : role === "owner"
                        ? "/owner/dashboard"
                        : role === "farmer"
                        ? "/farmer/dashboard"
                        : "/admin"
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
                className="rounded-lg shadow-xl w-full h-auto object-cover"
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
              {[
                {
                  icon: <Search className="h-6 w-6" />,
                  title: "Search",
                  description:
                    "Find available storage spaces in your area with our easy-to-use search tool.",
                },
                {
                  icon: <Home className="h-6 w-6" />,
                  title: "Book",
                  description:
                    "Reserve your storage space with just a few clicks. It's that simple.",
                },
                {
                  icon: <Leaf className="h-6 w-6" />,
                  title: "Store",
                  description:
                    "Safely store your crops and enjoy peace of mind knowing they're secure.",
                },
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-500 text-white mx-auto">
                    {step.icon}
                  </div>
                  <h3 className="mt-6 text-lg font-medium text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-base text-gray-500">
                    {step.description}
                  </p>
                </div>
              ))}
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
                  <p className="mt-4 text-gray-600">{testimonial.quote}</p>
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
                    : role === "farmer"
                    ? "/farmer/dashboard"
                    : "/admin"
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
      <footer className="bg-[#F0FDF4] p-8 rounded-lg shadow-lg">
        <div className="grid gap-6 md:grid-cols-3">
          <div className="">
            <h1 className="text-2xl font-bold text-green-900">
              Connecting Farmers to Trusted Warehouses{" "}
            </h1>
            <p className="text-gray-700 mt-2">
              Sanjeevani empowers farmers by providing trusted, secure, and
              accessible storage solutions. We innovate to ensure better crop
              preservation, minimize losses, and enhance agricultural
              efficiency, ultimately improving livelihoods and food security.
            </p>
          </div>
          <div>
            <b className="text-xl text-green-800">Location</b>
            <p className="mt-2 text-gray-700">Sanjeevani Storage Solutions</p>
            <p className="text-gray-700">26, Warehouse Street, Surat, 395004</p>
            <hr className="my-3 border-gray-300" />
            <p className="text-green-700 font-semibold">
              contact@sanjeevani.com | +91 7096348632
            </p>
          </div>
          <div className="p-4 text-center">
            <p className="mb-4 text-green-800 font-semibold">Follow Us On</p>
            <div className="flex flex-col justify-center items-center">
              <div className="flex justify-center space-x-6">
                <a href="#" className="text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Facebook</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="ml-6 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Instagram</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
                <a href="#" className="ml-6 text-gray-400 hover:text-gray-500">
                  <span className="sr-only">Twitter</span>
                  <svg
                    className="h-6 w-6"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-gray-500 mt-1">
          &copy; 2025 Sanjeevani. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
