"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Filter,
  Calendar,
  User,
  Phone,
  Mail,
  Warehouse,
  Clock,
  ChevronDown,
  ChevronUp,
  MapPin,
  Tag,
  ArrowUpDown,
  ArrowLeft,
} from "lucide-react";
import useAuth from "../hooks/useAuth";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

const MyCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedCustomer, setExpandedCustomer] = useState(null);
  const [userId, setUserId] = useState("");
  const token = useAuth();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.userId);
    }
  }, [token]);

  useEffect(() => {
    const fetchCustomers = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/bookings/customers`, {
          method: "POST",
          body: JSON.stringify({ userId }),
          headers: {
            "Content-Type": "application/json",
          },
        });
        const data = await response.json();
        // console.log(data.bookings);
        setCustomers(data.bookings);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
    setIsLoading(false);
  }, [userId]);

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Toggle customer details expansion
  const toggleExpand = (customerId) => {
    if (expandedCustomer === customerId) {
      setExpandedCustomer(null);
    } else {
      setExpandedCustomer(customerId);
    }
  };

  // Get status badge color
  // const getStatusColor = (status) => {
  //   switch (status) {
  //     case "active":
  //       return "bg-green-100 text-green-800";
  //     case "upcoming":
  //       return "bg-blue-100 text-blue-800";
  //     case "completed":
  //       return "bg-gray-100 text-gray-800";
  //     case "pending":
  //       return "bg-yellow-100 text-yellow-800";
  //     case "declined":
  //       return "bg-red-100 text-red-800";
  //     default:
  //       return "bg-gray-100 text-gray-800";
  //   }
  // };

  const normalizeDate = (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    return normalizedDate;
  };

  const categorizeBookings = () => {
    const today = normalizeDate(new Date());
    return {
      past: customers.filter(
        (booking) =>
          normalizeDate(booking.endDate) < today &&
          booking.approvalStatus == "approved"
      ),
      current: customers.filter(
        (booking) =>
          normalizeDate(booking.startDate) <= today &&
          normalizeDate(booking.endDate) >= today &&
          booking.approvalStatus == "approved" &&
          booking.warehouseId.isStandBy != true
      ),
      upcoming: customers.filter(
        (booking) =>
          normalizeDate(booking.startDate) > today &&
          booking.approvalStatus == "approved" &&
          booking.warehouseId.isStandBy != true
      ),
      declined: customers.filter(
        (booking) =>
          booking.approvalStatus == "rejected" && booking.status == "declined"
      ),
      pending: customers.filter(
        (booking) =>
          booking.approvalStatus == "pending" &&
          booking.status == "pending" &&
          booking.warehouseId.isStandBy != true
      ),
      awaiting: customers.filter(
        (booking) =>
          booking.warehouseId.isStandBy == true &&
          booking.status == "pending" &&
          booking.approvalStatus == "approved"
      ),
    };
  };
  const { past, current, upcoming, declined, pending, awaiting } =
    customers?.length
      ? categorizeBookings()
      : {
          past: [],
          current: [],
          upcoming: [],
          declined: [],
          pending: [],
          awaiting: [],
        };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 md:gap-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 rounded-full hover:bg-gray-50 transition-colors duration-200"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h1 className="text-xl font-semibold text-gray-900 md:text-3xl">
          Your Customers
        </h1>
      </div>

      {/* Customer List */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : customers?.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <p className="text-gray-600">
            No customers found matching your criteria.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider"
                  >
                    <span className="flex items-center space-x-1">
                      Customer
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 tracking-wider hidden md:table-cell"
                  >
                    <span className="flex items-center space-x-1">
                      Warehouse
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider hidden lg:table-cell"
                  >
                    <span className="flex items-center space-x-1">
                      Booking Period
                    </span>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500  tracking-wider hidden md:table-cell"
                  >
                    <span>Status</span>
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 md:text-right lg:text-left text-xs font-medium text-gray-500 tracking-wider"
                  >
                    <span>Details</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {customers &&
                  customers
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((customer) => (
                      <React.Fragment key={customer._id}>
                        <tr className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <a href={`users/f/show/${customer.userId._id}`}>
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                                  <img
                                    src={customer.userId.avatar}
                                    alt={customer.userId._id}
                                    className="w-9 h-9 rounded-full object-cover"
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">
                                    {customer.userId.name}
                                  </div>
                                  <div className="text-sm text-gray-500 hidden sm:block">
                                    {customer.userId.email}
                                  </div>
                                </div>
                              </div>
                            </a>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                            <div className="text-sm text-gray-900">
                              {customer.warehouseId.name}
                            </div>
                            <div className="text-xs text-gray-500 flex items-center">
                              <MapPin size={12} className="mr-1" />
                              {customer.warehouseId.location.formattedAddress}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap hidden lg:table-cell">
                            <div className="flex items-center text-sm text-gray-900">
                              <Calendar
                                size={16}
                                className="mr-2 text-gray-400"
                              />
                              <span>
                                {formatDate(customer.startDate)} -{" "}
                                {formatDate(customer.endDate)}
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap hidden md:table-cell">
                            <span
                              className={`text-xs font-medium bg-${
                                upcoming.includes(customer)
                                  ? "blue"
                                  : current.includes(customer)
                                  ? "green"
                                  : declined.includes(customer)
                                  ? "red"
                                  : pending.includes(customer)
                                  ? "yellow"
                                  : awaiting.includes(customer)
                                  ? "orange"
                                  : "gray"
                              }-100 text-${
                                upcoming.includes(customer)
                                  ? "blue"
                                  : current.includes(customer)
                                  ? "green"
                                  : declined.includes(customer)
                                  ? "red"
                                  : pending.includes(customer)
                                  ? "yellow"
                                  : awaiting.includes(customer)
                                  ? "orange"
                                  : "gray"
                              }-800 px-2 py-1 rounded-full text-sm`}
                            >
                              {upcoming.includes(customer)
                                ? "Upcoming"
                                : current.includes(customer)
                                ? "Active"
                                : declined.includes(customer)
                                ? "Declined"
                                : pending.includes(customer)
                                ? "Pending"
                                : awaiting.includes(customer)
                                ? "Awaiting Payment"
                                : "Completed"}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => toggleExpand(customer._id)}
                              className="text-blue-600 hover:text-blue-900 flex items-center justify-end"
                            >
                              {expandedCustomer === customer._id ? (
                                <>
                                  <span className="mr-1">Less</span>
                                  <ChevronUp size={16} />
                                </>
                              ) : (
                                <>
                                  <span className="mr-1">More</span>
                                  <ChevronDown size={16} />
                                </>
                              )}
                            </button>
                          </td>
                        </tr>

                        {/* Expanded details */}
                        {expandedCustomer === customer._id && (
                          <tr>
                            <td colSpan="5" className="px-6 py-4 bg-gray-50">
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Contact Information */}
                                <div className="bg-white p-4 rounded-lg shadow-sm">
                                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                                    Contact Information
                                  </h3>
                                  <div className="space-y-2">
                                    <div className="flex items-center">
                                      <Mail className="h-5 w-5 text-gray-400 mr-2" />
                                      <a
                                        href={`mailto:${customer.userId.email}`}
                                        className="text-blue-600 hover:underline"
                                      >
                                        {customer.userId.email}
                                      </a>
                                    </div>
                                    <div className="flex items-center">
                                      <Phone className="h-5 w-5 text-gray-400 mr-2" />
                                      <a
                                        href={`tel:${customer.userId.phoneno}`}
                                        className="text-blue-600 hover:underline"
                                      >
                                        {customer.userId.phoneno}
                                      </a>
                                    </div>
                                  </div>
                                </div>

                                {/* Bookings */}
                                <div className="bg-white p-4 rounded-lg shadow-sm col-span-1 md:col-span-2 lg:col-span-1">
                                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                                    Booking #{customer._id}
                                  </h3>
                                  <div className="space-y-2">
                                    <div className="flex items-start">
                                      <Warehouse className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                                      <div>
                                        <div className="font-medium">
                                          {customer.warehouseId.name}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {
                                            customer.warehouseId.location
                                              .formattedAddress
                                          }
                                        </div>
                                      </div>
                                    </div>
                                    <div className="flex items-center">
                                      <Calendar className="h-5 w-5 text-gray-400 mr-2" />
                                      <div>
                                        <div className="font-medium">
                                          Booking Period
                                        </div>
                                        <div className="text-sm text-gray-500">
                                          {formatDate(customer.startDate)} -{" "}
                                          {formatDate(customer.endDate)}
                                        </div>
                                      </div>
                                    </div>

                                    <div className="flex items-center">
                                      <Clock className="h-5 w-5 text-gray-400 mr-2" />
                                      <div>
                                        <div className="font-medium">
                                          Status
                                        </div>
                                        <div className="text-sm">
                                          <span
                                            className={`text-xs font-medium bg-${
                                              upcoming.includes(customer)
                                                ? "blue"
                                                : current.includes(customer)
                                                ? "green"
                                                : declined.includes(customer)
                                                ? "red"
                                                : pending.includes(customer)
                                                ? "yellow"
                                                : awaiting.includes(customer)
                                                ? "orange"
                                                : "gray"
                                            }-100 text-${
                                              upcoming.includes(customer)
                                                ? "blue"
                                                : current.includes(customer)
                                                ? "green"
                                                : declined.includes(customer)
                                                ? "red"
                                                : pending.includes(customer)
                                                ? "yellow"
                                                : awaiting.includes(customer)
                                                ? "orange"
                                                : "gray"
                                            }-800 px-2 py-1 rounded-full text-sm`}
                                          >
                                            {upcoming.includes(customer)
                                              ? "Upcoming"
                                              : current.includes(customer)
                                              ? "Active"
                                              : declined.includes(customer)
                                              ? "Declined"
                                              : pending.includes(customer)
                                              ? "Pending"
                                              : awaiting.includes(customer)
                                              ? "Awaiting Payment"
                                              : "Completed"}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="pt-2 border-t border-gray-200 mt-2">
                                      <div className="flex justify-between items-center">
                                        <span className="text-sm text-gray-500">
                                          Total Amount
                                        </span>
                                        <span className="text-lg font-bold text-gray-900">
                                          ₹
                                          {customer.totalPrice.toLocaleString()}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyCustomers;
