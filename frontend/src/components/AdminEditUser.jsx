import { useState } from "react";
import { ArrowLeft, Lock, Save, Unlock, X } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminEditUser = ({ user, onSave, onCancel, handleDeactivation }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user.name || "",
    email: user.email || "",
    about: user.about || "",
    role: user.role || "farmer",
    phoneno: user.phoneno || "",
    address: user.address || "",
    isDeactivated: user.isDeactivated || false,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-2 mb-4">
        <button
          onClick={() => navigate(-1)}
          className="md:p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
          aria-label="Go back"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Edit User</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Role
            </label>
            <input
              type="role"
              id="role"
              name="role"
              value={formData.role}
              // onChange={handleChange}
              disabled={true}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-not-allowed"
              required
            />
            {/* <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled=
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="farmer">Farmer</option>
              <option value="owner">Owner</option>
            </select> */}
          </div>
          <div>
            <label
              htmlFor="phoneno"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Phone Number
            </label>
            <input
              type="tel"
              id="phoneno"
              name="phoneno"
              value={formData.phoneno}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="md:col-span-2">
            <label
              htmlFor="about"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              About
            </label>
            <textarea
              id="about"
              name="about"
              value={formData.about}
              onChange={handleChange}
              rows="4"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>
        </div>
        <div className="mt-6 flex flex-col md:flex-row md:items-center gap-2">
          <button
            type="button"
            name="isDeactivated"
            onClick={handleDeactivation}
            className={`flex items-center justify-center px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500
              ${
                formData.isDeactivated
                  ? "border-green-300 text-green-700 hover:bg-green-50"
                  : "border-red-300 text-red-700 hover:bg-red-50"
              }
              `}
          >
            {formData.isDeactivated ? (
              <>
                <Unlock className="w-5 h-5 inline-block mr-1" />
                Activate
              </>
            ) : (
              <>
                <Lock className="w-5 h-5 inline-block mr-1" />
                Deactivate
              </>
            )}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 flex items-center justify-center"
          >
            <X className="w-5 h-5 inline-block mr-1" />
            Cancel
          </button>
          <button
            type="submit"
            className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center"
          >
            <Save className="w-5 h-5 inline-block mr-1" />
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditUser;
