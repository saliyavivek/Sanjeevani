import { useEffect, useState } from "react";
import { Edit, Trash2, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { showErrorToast, showSuccessToast } from "./toast";
import DeleteAccountModal from "./DeleteAccountModal";

const UserManagement = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const fetchAllUsers = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/all-users`);
      if (!response.ok) {
        console.log("Error while fetching all users.");
        return;
      }
      const data = await response.json();
      setAllUsers(data.allUsers);
      setUsers(data.allUsers);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchAllUsers();
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

  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();

    if (searchTerm === "") {
      setUsers(allUsers); // Reset to original users
    } else {
      const filteredUsers = allUsers.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm) ||
          user.role.toLowerCase().includes(searchTerm)
      );
      setUsers(filteredUsers);
    }
  };

  const handleDeleteAccount = async () => {
    // console.log("deleting account of", userId);
    setIsDeleteModalOpen(false);

    try {
      const response = await fetch(`${API_BASE_URL}/users/delete-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: selectedUserId,
        }),
      });
      if (!response.ok) {
        console.log("Error while deleting the user.");
        return;
      }

      const data = await response.json();
      showSuccessToast("User has been deleted.");
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to delete account. Please try again.");
    }
  };

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">
        User Management
      </h2>
      <div className="mb-4 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search users..."
            className="w-full px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500"
            // value={searchTerm}
            onChange={handleSearch}
          />
          <Search className="absolute right-3 top-2 text-gray-400" size={20} />
        </div>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none">
          Add User
        </button>
      </div>
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100">
            <tr className="text-gray-700 text-sm leading-normal">
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left hidden md:table-cell">
                Email
              </th>
              <th className="py-3 px-6 text-left hidden sm:table-cell">Role</th>
              <th className="py-3 pr-6 text-left hidden sm:table-cell">
                Registered On
              </th>
              <th className="hidden sm:table-cell"></th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm">
            {users
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="py-3 px-6">
                    <div>
                      <a
                        href={`/users/${
                          user.role === "farmer" ? "f" : "o"
                        }/show/${user._id}`}
                      >
                        <p className="font-medium">
                          <div className="flex items-center gap-2">
                            <img
                              src={user.avatar}
                              alt=""
                              className="w-9 h-9 rounded-full object-cover hidden md:block"
                            />
                            {user.name}
                          </div>
                        </p>
                      </a>
                      <p className="text-xs text-gray-500 md:hidden">
                        {user.email}
                      </p>
                      <p className="text-xs text-gray-500 sm:hidden">
                        {user.role}
                      </p>
                    </div>
                  </td>
                  <td className="py-3 px-6 hidden md:table-cell">
                    {user.email}
                  </td>
                  <td className="py-3 px-6 hidden sm:table-cell">
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </td>
                  <td className="py-3 pr-6 text-left hidden sm:table-cell">
                    {normalizeDate(user.createdAt)}
                  </td>
                  <td className="hidden sm:table-cell">
                    {user.isDeactivated ? (
                      <p className="text-center bg-red-200 text-red-800 py-1 rounded-full text-xs">
                        Deactivated
                      </p>
                    ) : (
                      ""
                    )}
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      className="mr-2 text-blue-500 hover:text-blue-700"
                      onClick={() =>
                        navigate(`/admin/edit/${user._id}?type=user`)
                      }
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => {
                        setSelectedUserId(user._id);
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <DeleteAccountModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirmDelete={handleDeleteAccount}
      />
    </div>
  );
};

export default UserManagement;
