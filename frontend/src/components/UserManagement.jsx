import { useEffect, useState } from "react";
import { Search, Edit, Trash } from "lucide-react";

const UserManagement = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);

  const fetchAllUsers = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users/all-users");
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

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            User Management
          </h3>
          <div className="relative">
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              onChange={handleSearch}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          </div>
        </div>
        <table className="w-full">
          <thead>
            <tr className="text-left text-gray-500 border-b">
              {/* <th className="pb-3 font-medium">Avatar</th> */}
              <th className="pb-3 font-medium">Name</th>
              <th className="pb-3 font-medium">Email</th>
              <th className="pb-3 font-medium">Role</th>
              <th className="pb-3 font-medium">Registered On</th>
              <th className="pb-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users
              .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
              .map((user) => (
                <tr key={user.id} className="border-b last:border-b-0">
                  <td className="py-3">
                    <a
                      href={`/users/${
                        user.role === "farmer" ? "f" : "o"
                      }/show/${user._id}`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={user.avatar}
                          alt=""
                          className="w-9 h-9 rounded-full object-cover"
                        />
                        {user.name}
                      </div>
                    </a>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                  </td>
                  <td>{normalizeDate(user.createdAt)}</td>
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

export default UserManagement;
