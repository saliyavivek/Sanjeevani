import React, { useEffect, useState } from "react";
import {
  MapPin,
  Check,
  ChevronRight,
  BadgeCheck,
  ArrowLeft,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useNavigate, useParams } from "react-router-dom";

const HostProfile = () => {
  const host = {
    name: "Monica",
    image: "/placeholder.svg?height=200&width=200",
    yearsHosting: 8,
    location: "Pushkar, India",
    verifiedInfo: ["Identity", "Email address", "Phone number"],
    listings: [
      {
        id: 1,
        type: "Farm stay",
        title: "Peeli Kothi is ideal 4 shooting with...",
        images: ["/placeholder.svg?height=300&width=400"],
        totalImages: 8,
        currentImage: 7,
      },
      {
        id: 2,
        type: "Rental unit",
        title: "1 bhk fully furnished apartment",
        images: ["/placeholder.svg?height=300&width=400"],
        totalImages: 6,
        currentImage: 1,
      },
      {
        id: 3,
        type: "Farm stay",
        title: "Blue Mountain Farm",
        images: ["/placeholder.svg?height=300&width=400"],
        totalImages: 10,
        currentImage: 1,
      },
    ],
  };

  //   const [userId, setUserId] = useState();
  const [user, setUser] = useState();
  const [warehouses, setWarehouses] = useState([]);
  const verifiedInfo = ["Email address", "Phone number"];
  const navigate = useNavigate();
  const { id } = useParams();

  const fetchPersonalDetails = async () => {
    const response = await fetch("http://localhost:8080/api/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: id,
      }),
    });
    const data = await response.json();
    setUser(data);
  };

  const fetchListings = async () => {
    const response = await fetch("http://localhost:8080/api/bookings/getall", {
      method: "POST",
      body: JSON.stringify({
        userId: id,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.ok) {
      const data = await response.json();
      setWarehouses(data);
      // console.log(warehouses);

      // console.log(data);
    }
  };
  useEffect(() => {
    fetchPersonalDetails();
    fetchListings();
  }, [id]);

  const calculateDuration = (dateString) => {
    const currentDate = new Date();
    const targetDate = new Date(dateString);
    const difference = currentDate - targetDate;

    const totalDays = difference / (1000 * 60 * 60 * 24);
    const totalMonths = difference / (1000 * 60 * 60 * 24 * 30);
    const totalYears = difference / (1000 * 60 * 60 * 24 * 365);

    if (currentDate.getMonth() === targetDate.getMonth()) {
      return `${Math.round(totalDays)} day(s)`;
    } else if (totalMonths < 12) {
      return `${Math.round(totalMonths)} month(s)`;
    } else {
      return `${Math.round(totalYears)} year(s)`;
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-2 md:gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="md:p-2 rounded-full hover:bg-gray-50 transition-colors duration-200"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-3xl font-semibold text-gray-900">
          {user.role === "owner" ? "Meet your host" : `Know ${user.name}`}
        </h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column - Profile Info */}
        <div className="space-y-6">
          {/* Profile Card */}
          <div className="bg-white rounded-xl shadow-sm p-2 md:p-6">
            <div className="relative inline-block">
              <img
                src={user.avatar}
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover"
              />
              <BadgeCheck className="absolute bottom-0 right-0 w-6 h-6 text-emerald-600 bg-white rounded-full" />
            </div>
            <div className="mt-4">
              <h1 className="text-2xl font-semibold">{user.name}</h1>
              <p className="text-gray-600">
                {user.role === "owner"
                  ? "Host"
                  : `${warehouses.length} bookings till now`}
              </p>
            </div>
            <div className="mt-4">
              <div className="flex items-center text-lg">
                <span className="font-semibold">
                  {calculateDuration(user.createdAt)}
                </span>
                <span className="ml-1 text-gray-600">
                  {user.role === "owner" ? "hosting" : "on Sanjeevani"}
                </span>
              </div>
            </div>
          </div>

          {/* Verified Information Card */}
          <div className="bg-white rounded-xl shadow-sm p-2 md:p-6">
            <h2 className="text-xl font-semibold mb-4">
              {user.name}'s confirmed information
            </h2>
            <ul className="space-y-3">
              {verifiedInfo.map((info, index) => (
                <li key={index} className="flex items-center text-gray-600">
                  <Check className="w-5 h-5 mr-2 text-gray-400" />
                  {info}
                </li>
              ))}
            </ul>
            {/* <button className="mt-4 text-gray-600 underline text-sm hover:text-gray-900">
              Learn about identity verification
            </button> */}
          </div>
        </div>

        {/* Right Column - About and Listings */}
        <div className="space-y-8 p-2">
          {/* About Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">About {user.name}</h2>
            <p className="text-gray-600 mb-3">{user.about ? user.about : ""}</p>
            <div className="flex items-center text-gray-600">
              <MapPin className="w-5 h-5 mr-2" />
              Lives in {user.address}
            </div>
          </div>

          {/* Listings Section */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              {user.name}'s recent bookings
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {warehouses.slice(0, 6).map((listing) => (
                <a href={`/warehouse/${listing._id}`}>
                  <div key={listing._id} className="group cursor-pointer">
                    <div className="relative aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
                      <img
                        src={listing.warehouseId.images[0]}
                        alt={listing.warehouseId.title}
                        className="w-full h-[122px] object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                    </div>
                    <div className="mt-2">
                      <p className="font-medium text-gray-900">
                        {listing.warehouseId.name}
                      </p>
                      <p className="text-gray-600 text-sm truncate">
                        {listing.warehouseId.description}
                      </p>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HostProfile;
