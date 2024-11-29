import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { ArrowLeft, Upload } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { validateForm } from "../utils/FormValidation";
import { jwtDecode } from "jwt-decode";
import useAuth from "../hooks/useAuth";
import { useDropzone } from "react-dropzone";
import { useLocation, useNavigate } from "react-router-dom";

const AddNewListing = () => {
  useAuth();
  const location = useLocation();
  const { existingWarehouse } = location.state || {};
  const warehouseId = location.state?.existingWarehouse?._id;
  console.log(warehouseId);

  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    pricePerMonth: "",
    description: "",
    availability: "",
    image: null,
    location: {
      type: "Point",
      coordinates: [78.9629, 20.5937], // Default to India's center
      formattedAddress: "",
      city: "",
      state: "",
      country: "",
    },
  });

  useEffect(() => {
    if (existingWarehouse) {
      console.log(existingWarehouse);

      setFormData({
        name: existingWarehouse.name,
        size: existingWarehouse.size,
        pricePerMonth: existingWarehouse.pricePerMonth,
        description: existingWarehouse.description,
        availability: existingWarehouse.availability,
        image: null, // Handle image separately
        location: existingWarehouse.location && {
          type: "Point",
          coordinates: existingWarehouse.location.coordinates, // Default to India's center
          formattedAddress: existingWarehouse.location.formattedAddress,
          city: existingWarehouse.location.city,
          state: existingWarehouse.location.state,
          country: existingWarehouse.location.country,
        },
      });
      console.log(formData);

      // Set image preview if needed
      setImagePreview(existingWarehouse.images[0]);
    }
  }, [existingWarehouse]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (name === "location.formattedAddress") {
      // Geocode to get detailed location
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${value}`)
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            const { lat, lon, display_name, address } = data[0];
            setFormData((prevState) => ({
              ...prevState,
              location: {
                ...prevState.location,
                coordinates: [parseFloat(lon), parseFloat(lat)],
                formattedAddress: display_name,
                city: address?.city || "",
                state: address?.state || "",
                country: address?.country || "",
              },
            }));
          }
        });
    }
  };

  const handleMapClick = (lat, lng) => {
    // Reverse geocode to update location details
    fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data && data.display_name) {
          const { display_name, address } = data;
          setFormData((prevState) => ({
            ...prevState,
            location: {
              type: "Point",
              coordinates: [lng, lat], // Update coordinates correctly
              formattedAddress: display_name,
              city: address?.city || "",
              state: address?.state || "",
              country: address?.country || "",
            },
          }));
        }
      });
  };

  const handleImageChange = (acceptedFiles) => {
    const file = acceptedFiles[0]; // Get the first file from the accepted files
    if (file) {
      if (!file.type.startsWith("image/")) {
        console.error("Invalid file type. Please upload an image.");
        return; // Exit if the file type is not valid
      }
      setFormData((prevState) => ({
        ...prevState,
        image: file,
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set the image preview
      };
      reader.readAsDataURL(file);
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleImageChange,
    accept: {
      "image/*": [], // Accept all image types
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formDataToSend = new FormData();
    formDataToSend.append("ownerId", currentUserId);

    // Append the image file
    if (formData.image) {
      formDataToSend.append("image", formData.image);
    }

    if (warehouseId) {
      formDataToSend.append("warehouseId", warehouseId);
    }

    // Append other form fields
    Object.keys(formData).forEach((key) => {
      if (key !== "image") {
        if (key === "location") {
          // Handle location object
          Object.keys(formData.location).forEach((locKey) => {
            if (locKey === "coordinates") {
              // Append coordinates as separate fields
              formDataToSend.append(
                "longitude",
                formData.location.coordinates[0]
              );
              formDataToSend.append(
                "latitude",
                formData.location.coordinates[1]
              );
            } else {
              formDataToSend.append(
                `location[${locKey}]`,
                formData.location[locKey]
              );
            }
          });
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
    });

    try {
      const response = await fetch(
        `http://localhost:8080/api/warehouses/${warehouseId ? "edit" : "add"}`,
        {
          method: warehouseId ? "PUT" : "POST",
          body: formDataToSend,
        }
      );

      if (response.ok) {
        const data = await response.json();
        console.log(data.message);
        navigate("/listings");
      } else {
        const errorData = await response.json();
        console.error("Error saving warehouse:", errorData);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  const MapEvents = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        handleMapClick(lat, lng);
      },
    });
    return null;
  };

  useEffect(() => {
    validateForm();
  });

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      try {
        const decodedToken = jwtDecode(storedToken);
        setCurrentUserId(decodedToken.userId);
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      {/* <div className="p-4 border-b bg-white">
        <div className="max-w-[1400px] mx-auto">
          <a
            href="/owner"
            className="inline-flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Dashboard
          </a>
        </div>
      </div> */}

      {/* Main Content */}
      <div className="max-w-[1400px] mx-auto p-4">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Form */}
          <div className="flex-1 lg:max-w-[600px]">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h1 className="text-2xl font-semibold text-gray-900 mb-6">
                {existingWarehouse ? "Edit this Listing" : "Add New Listing"}
              </h1>

              <form
                onSubmit={handleSubmit}
                className="space-y-6 needs-validation"
                noValidate
                encType="multipart/form-data"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Warehouse Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="form-control mt-1 block w-full rounded-lg px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="invalid-feedback">Name is required.</div>
                </div>

                <div>
                  <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Location
                  </label>
                  <div className="mt-1 relative">
                    <input
                      type="text"
                      id="location.formattedAddress"
                      name="location.formattedAddress"
                      value={formData.location.formattedAddress}
                      onChange={handleChange}
                      required
                      className="form-control mt-1 block w-full rounded-lg px-3 py-2 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      placeholder="Enter address"
                    />
                    <div className="invalid-feedback">
                      Location is required.
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="size"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Size (sq ft)
                    </label>
                    <input
                      type="number"
                      id="size"
                      name="size"
                      value={formData.size}
                      onChange={handleChange}
                      required
                      className="form-control mt-1 block w-full rounded-lg px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <div className="invalid-feedback">Size is required.</div>
                  </div>

                  <div>
                    <label
                      htmlFor="pricePerMonth"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Price per Month (₹)
                    </label>
                    <input
                      type="number"
                      id="pricePerMonth"
                      name="pricePerMonth"
                      value={formData.pricePerMonth}
                      onChange={handleChange}
                      required
                      className="form-control mt-1 block w-full rounded-lg px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <div className="invalid-feedback">Price is required.</div>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    className="form-control mt-1 block w-full rounded-lg px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <div className="invalid-feedback">
                    Description is required.
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="availability"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Availability
                  </label>
                  <select
                    id="availability"
                    name="availability"
                    value={formData.availability}
                    onChange={handleChange}
                    required
                    className="form-control mt-1 block w-full rounded-lg px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select availability</option>
                    <option value="available">Available</option>
                    <option value="booked">Booked</option>
                    <option value="maintenance">Under Maintenance</option>
                  </select>
                  <div className="invalid-feedback">
                    Availability is required.
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Warehouse Images
                  </label>
                  {/* <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="image"
                          className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                        >
                          <span>Upload files</span>
                          <input
                            id="image"
                            name="image"
                            type="file"
                            className="sr-only"
                            onChange={handleImageChange}
                            required
                            accept="image/*"
                          />
                        </label>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div> */}
                  <div
                    {...getRootProps({
                      className:
                        "mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer",
                    })}
                  >
                    <input {...getInputProps()} />
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="text-sm text-gray-600">
                        Drag & drop your image here, or click to select files
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </div>
                  {imagePreview && (
                    <div className="mt-4">
                      <h3 className="text-sm font-medium text-gray-700">
                        Image Preview:
                      </h3>
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mt-2 w-full h-auto rounded-lg border border-gray-300"
                      />
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-lg border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    {existingWarehouse ? "Update Listing" : "Add Listing"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="flex-1 lg:max-w-[800px]">
            <div className="bg-white rounded-xl shadow-sm p-6 h-[calc(100vh-140px)] sticky top-4">
              <div className="h-full rounded-lg overflow-hidden">
                <MapContainer
                  center={formData.location.coordinates.slice().reverse()} // Reverse coordinates for map center
                  zoom={11}
                  style={{ height: "100%", width: "100%" }}
                  key={formData.location.coordinates.toString()} // Force map re-render on coordinate change
                >
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                  <Marker
                    position={formData.location.coordinates.slice().reverse()}
                  >
                    <Popup>
                      {formData.location.formattedAddress ||
                        "Selected Location"}
                    </Popup>
                  </Marker>
                  <MapEvents />
                </MapContainer>
                ;
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddNewListing;
