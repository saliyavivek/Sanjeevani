import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { ArrowLeft, Upload, X } from "lucide-react";
import "leaflet/dist/leaflet.css";
import { validateForm } from "../utils/FormValidation";
import { jwtDecode } from "jwt-decode";
import useAuth from "../hooks/useAuth";
import { useDropzone } from "react-dropzone";
import { useLocation, useNavigate } from "react-router-dom";
import {
  showErrorToast,
  showLoadingToast,
  showSuccessToast,
} from "../components/toast";
import AIDescriptionGenerator from "../components/AIDescriptionGenerator";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  shadowSize: [41, 41],
});

const AddNewListing = () => {
  useAuth();
  const location = useLocation();
  const { existingWarehouse } = location.state || {};
  const warehouseId = location.state?.existingWarehouse?._id;
  const [isLoading, setIsLoading] = useState(false);
  // console.log(warehouseId);

  const navigate = useNavigate();
  const [imagePreview, setImagePreview] = useState([]);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    size: "",
    pricePerDay: "",
    description: "",
    availability: "available",
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
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    if (existingWarehouse) {
      // console.log(existingWarehouse);

      setFormData({
        name: existingWarehouse.name,
        size: existingWarehouse.size,
        pricePerDay: existingWarehouse.pricePerDay,
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
      // console.log(formData);

      // Set image preview if needed
      setImagePreview(existingWarehouse.images);
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
                coordinates: [Number.parseFloat(lon), Number.parseFloat(lat)],
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
    const file = acceptedFiles[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        showErrorToast("Invalid file type. Please upload an image.");
        return;
      }

      // Compress image before upload
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const MAX_WIDTH = 1200;
          const MAX_HEIGHT = 1200;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], file.name, {
                type: "image/jpeg",
                lastModified: Date.now(),
              });

              setFormData((prevState) => ({
                ...prevState,
                image: compressedFile,
              }));

              setImagePreview((prevImages) => [
                ...prevImages,
                URL.createObjectURL(compressedFile),
              ]);
            },
            "image/jpeg",
            0.8
          );
        };
        img.src = e.target.result;
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

    if (Number(formData.size) <= 0) {
      showErrorToast("Please enter a valid size.");
      return;
    }

    if (Number(formData.pricePerDay) <= 0) {
      showErrorToast("Please enter a valid price.");
      return;
    }

    if (!existingWarehouse && !formData.image) {
      showErrorToast("Please select an image for your warehouse.");
      return;
    }

    setIsLoading(true);
    const loadingToastId = showLoadingToast(
      warehouseId ? "Updating your warehouse..." : "Listing your warehouse..."
    );

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
        `${API_BASE_URL}/warehouses/${warehouseId ? "edit" : "add"}`,
        {
          method: warehouseId ? "PUT" : "POST",
          body: formDataToSend,
        }
      );

      if (response.ok) {
        const data = await response.json();
        showSuccessToast(data.message, loadingToastId);
        // console.log(data.message);
        navigate("/listings");
      } else {
        const errorData = await response.json();
        showErrorToast(errorData.message, loadingToastId);
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

  const handleDescriptionGenerated = (generatedDescription) => {
    setFormData((prevState) => ({
      ...prevState,
      description: generatedDescription,
    }));
  };

  const handleDeleteImage = async (warehouseId, index) => {
    const response = await fetch(
      `${API_BASE_URL}/warehouses/${warehouseId}/delete/${index}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      console.log("Something went wrong");
      return;
    }
    const data = await response.json();
    showSuccessToast(data.message);
    setImagePreview((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-white-50">
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
      <div className="max-w-[1400px] mx-auto p-2 md:p-4">
        <div className="flex items-center gap-2 mb-4 mt-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-gray-50 transition-colors duration-200"
            aria-label="Go back"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            {existingWarehouse ? "Edit this Listing" : "Add New Listing"}
          </h1>
        </div>
        <div className="flex flex-col-reverse lg:flex-row gap-8">
          {/* Left Column - Form */}
          <div className="flex-1 lg:max-w-[600px]">
            <div className="bg-white rounded-xl  p-6">
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
                      htmlFor="pricePerDay"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Price per Day (₹)
                    </label>
                    <input
                      type="number"
                      id="pricePerDay"
                      name="pricePerDay"
                      value={formData.pricePerDay}
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
                  <div className="mt-1 relative">
                    <textarea
                      id="description"
                      name="description"
                      rows="5"
                      value={formData.description}
                      onChange={handleChange}
                      required
                      className="form-control block w-full rounded-lg px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <div className="invalid-feedback">
                      Description is required.
                    </div>
                  </div>
                  <div className="mt-2">
                    <AIDescriptionGenerator
                      name={formData.name}
                      size={formData.size}
                      location={formData.location.formattedAddress}
                      onDescriptionGenerated={handleDescriptionGenerated}
                      isDisabled={
                        formData.name == "" ||
                        formData.location.formattedAddress == "" ||
                        formData.size == "" ||
                        formData.pricePerDay == ""
                      }
                    />
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
                  {imagePreview && (
                    <div className="mt-4 mb-4">
                      <h3 className="text-sm font-medium text-gray-700">
                        Image Preview:
                      </h3>
                      <div className="grid grid-cols-2">
                        {imagePreview.map((img, index) => (
                          <div key={index} className="relative">
                            <img
                              src={img || "/placeholder.svg"}
                              alt={`Preview ${index + 1}`}
                              className="mt-2 w-full h-auto rounded-lg border border-gray-300"
                            />
                            {imagePreview.length > 1 && (
                              <X
                                onClick={() =>
                                  handleDeleteImage(warehouseId, index)
                                }
                                className="w-6 h-6 absolute top-4 right-3 hover:text-gray-700 bg-gray-50 hover:bg-gray-100 p-1 rounded-full transition-colors duration-200 cursor-pointer"
                              />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  {!warehouseId && (
                    <>
                      <label className="block text-sm font-medium text-gray-700">
                        Upload Image
                      </label>
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
                            Drag & drop your image here, or click to select
                            files
                          </p>
                          <p className="text-xs text-gray-500">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </div>
                      </div>
                      {/* Mobile Camera Capture */}
                      <div className="mt-4 md:hidden">
                        <label className="block text-sm font-medium text-gray-700">
                          Or take a photo
                        </label>
                        <input
                          type="file"
                          accept="image/*"
                          capture="environment"
                          className="hidden"
                          id="cameraInput"
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleImageChange([e.target.files[0]]);
                            }
                          }}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            document.getElementById("cameraInput").click()
                          }
                          className="mt-1 w-full flex justify-center items-center px-6 py-3 border-2 border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
                        >
                          <Upload className="w-5 h-5 mr-2" />
                          Take Photo
                        </button>
                      </div>
                    </>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-lg border border-transparent bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                  >
                    {existingWarehouse ? "Update Listing" : "Add Listing"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Map */}
          <div className="flex-1 lg:max-w-[800px]">
            <div className="bg-white rounded-xl p-3 h-[calc(100vh-340px)] lg:h-[calc(100vh-140px)] sticky top-4">
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
                    icon={markerIcon}
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
