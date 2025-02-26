import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Edit, Trash2, Search, MapPin } from "lucide-react";
import { showErrorToast, showSuccessToast } from "./toast";

const WarehouseManagement = () => {
  const [warehouses, setWarehouses] = useState([]);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchAllWarehouses = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/warehouses/all-warehouses`);
      if (!response.ok) {
        console.log("Error while fetching all warehouses.");
        return;
      }
      const data = await response.json();
      setWarehouses(data.allWarehouses);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllWarehouses();
  }, []);

  const normalizeDate = (date) => {
    const normalizedDate = new Date(date);
    normalizedDate.setHours(0, 0, 0, 0);
    return normalizedDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const [searchTerm, setSearchTerm] = useState("");

  const filteredWarehouses = warehouses.filter(
    (warehouse) =>
      warehouse.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      warehouse.location.formattedAddress
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/warehouses/delete`, {
        method: "DELETE",
        body: JSON.stringify({ warehouseId: id }),
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        const data = await response.json();
        showSuccessToast(data.message);
      } else {
        const errorData = await response.json();
        showErrorToast(errorData.message);
        console.error("Error deleting warehouse:", errorData);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
        Warehouse Management
      </h2>
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search warehouses..."
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute right-3 top-2 text-gray-400" size={20} />
        </div>
        <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none">
          Add Warehouse
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr className="text-gray-700 text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left hidden sm:table-cell">
                Owner
              </th>
              <th className="py-3 px-6 text-left hidden sm:table-cell">
                Location
              </th>
              <th className="py-3 px-6 text-left hidden md:table-cell">
                Capacity
              </th>
              <th className="py-3 px-6 text-left hidden md:table-cell">
                Listed on
              </th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {filteredWarehouses
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((warehouse) => (
                <tr
                  key={warehouse.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-6">
                    <div>
                      <p className="font-medium">{warehouse.name}</p>
                      <p className="text-xs text-gray-500 flex sm:hidden">
                        <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                        {warehouse.location.formattedAddress.substring(0, 35) +
                          "..."}
                      </p>
                      <p className="text-xs text-gray-500 md:hidden">
                        {warehouse.size} sq. ft.
                      </p>
                      <p className="text-xs text-gray-500 lg:hidden">
                        {normalizeDate(warehouse.createdAt)}
                      </p>
                    </div>
                  </td>

                  <td className="py-3 px-6 hidden sm:table-cell">
                    {warehouse.ownerId.name}
                  </td>

                  <td className="py-3 px-6 hidden sm:table-cell">
                    <div className="flex items-center">
                      <MapPin size={16} className="mr-2 text-gray-400" />
                      {warehouse.location.formattedAddress.substring(0, 35) +
                        "..."}
                    </div>
                  </td>
                  <td className="py-3 px-6 hidden md:table-cell">
                    {warehouse.size} sq. ft.
                  </td>
                  <td className="py-3 px-6 hidden md:table-cell">
                    {normalizeDate(warehouse.createdAt)}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      className={`mr-2 text-blue-500 hover:text-blue-700  ${
                        warehouse.availability !== "available"
                          ? "cursor-not-allowed opacity-50"
                          : ""
                      }
                        `}
                      onClick={() =>
                        navigate(`/admin/edit/${warehouse._id}?type=warehouse`)
                      }
                      disabled={warehouse.availability !== "available"}
                      title={
                        warehouse.availability !== "available"
                          ? "Can not edit currently booked warehouse"
                          : ""
                      }
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className={`text-red-500 hover:text-red-700
                        ${
                          warehouse.availability !== "available"
                            ? "cursor-not-allowed opacity-50"
                            : ""
                        }
                        `}
                      title={
                        warehouse.availability !== "available"
                          ? "Can not delete currently booked warehouse"
                          : ""
                      }
                      onClick={() => handleDelete(warehouse._id)}
                      disabled={warehouse.availability !== "available"}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WarehouseManagement;
