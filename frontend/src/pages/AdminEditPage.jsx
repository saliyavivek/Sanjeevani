import { useState, useEffect } from "react";
import AdminEdituser from "../components/AdminEditUser";
import AdminEditWarehouse from "../components/AdminEditWarehouse";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "../components/toast";

const AdminEditPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const type = searchParams.get("type");

  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchData = async () => {
    try {
      let response;
      if (type === "user") {
        response = await fetch(`${API_BASE_URL}/users/user/${id}`);
      } else if (type === "warehouse") {
        response = await fetch(`${API_BASE_URL}/warehouses/warehouse/${id}`);
      } else {
        console.error("Invalid type:", type);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const jsonData = await response.json();
      setData(jsonData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id, type]);

  const handleSave = async (updatedData) => {
    try {
      let response;
      if (type === "user") {
        response = await fetch(`${API_BASE_URL}/users/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        });

        if (response.ok) {
          showSuccessToast("User updated.");
        } else {
          showErrorToast("Error while updating user.");
        }
      } else if (type === "warehouse") {
        response = await fetch(`${API_BASE_URL}/warehouses/edit`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...updatedData, warehouseId: id }),
        });

        if (response.ok) {
          showSuccessToast("Warehouse updated.");
        } else {
          showErrorToast("Error while updating warehouse.");
        }
      } else {
        console.error("Invalid type:", type);
        return;
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Optionally, update the local state with the new data
      setData(updatedData);

      // Handle success (e.g., show a success message, navigate back)
      console.log("Data updated successfully!");
    } catch (error) {
      console.error("Error updating data:", error);
      // Handle error (e.g., show an error message)
    }
  };

  const handleCancel = () => {
    // Handle cancellation (e.g., navigate back)
    navigate(-1);
    // console.log("Cancelled");
  };

  const handleDeactivation = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/user/${id}/manage`, {
        method: "PUT",
      });

      if (response.ok) {
        const data = await response.json();
        showSuccessToast(data.message);
      } else {
        showErrorToast("Error while managing user.");
      }
    } catch (error) {}
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {type === "user" ? (
        <AdminEdituser
          user={data}
          onSave={handleSave}
          onCancel={handleCancel}
          handleDeactivation={handleDeactivation}
        />
      ) : (
        <AdminEditWarehouse
          warehouse={data}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      )}
    </div>
  );
};

export default AdminEditPage;
