import { useEffect, useState } from "react";
import { Search, Edit, Trash, MapPin } from "lucide-react";

const WarehouseListings = () => {
  // const [warehouses, setWarehouses] = useState([
  //   {
  //     id: 1,
  //     name: "Green Acres Storage",
  //     location: "Springfield, IL",
  //     capacity: "10,000 sq ft",
  //     occupancy: "80%",
  //   },
  //   {
  //     id: 2,
  //     name: "Harvest Haven",
  //     location: "Bloomington, IN",
  //     capacity: "8,000 sq ft",
  //     occupancy: "65%",
  //   },
  //   {
  //     id: 3,
  //     name: "Crop Keeper",
  //     location: "Des Moines, IA",
  //     capacity: "15,000 sq ft",
  //     occupancy: "90%",
  //   },
  //   {
  //     id: 4,
  //     name: "Farm Fresh Storage",
  //     location: "Madison, WI",
  //     capacity: "12,000 sq ft",
  //     occupancy: "75%",
  //   },
  //   {
  //     id: 5,
  //     name: "Silo Solutions",
  //     location: "Columbus, OH",
  //     capacity: "20,000 sq ft",
  //     occupancy: "85%",
  //   },
  // ]);

  const [warehouses, setWarehouses] = useState([]);

  const fetchAllWarehouses = async () => {
    try {
      const response = await fetch(
        "http://localhost:8080/api/warehouses/all-warehouses"
      );
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

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Warehouse Listings
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search warehouses..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Location</th>
              <th className="pb-3 font-medium">Capacity</th>
              <th className="pb-3 font-medium">Listed on</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {warehouses
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((warehouse) => (
                <tr key={warehouse.id} className="border-b last:border-b-0">
                  <td className="py-3">{warehouse.name}</td>
                  <td className="flex items-center py-3">
                    <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                    {warehouse.location.formattedAddress.substring(0, 35) +
                      "..."}
                  </td>
                  <td>{warehouse.size} sq. ft.</td>
                  {/* <td>
                  <div className="w-24 bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-green-600 h-2.5 rounded-full"
                      style={{ width: warehouse.occupancy }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    {warehouse.occupancy}
                  </span>
                </td> */}
                  <td>{normalizeDate(warehouse.createdAt)}</td>
                  <td>
                    <div className="flex space-x-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <Edit className="w-5 h-5" />
                      </button>
                      <button className="text-red-600 hover:text-red-800">
                        <Trash className="w-5 h-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WarehouseListings;
