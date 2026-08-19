import { Input } from "@base-ui/react";
import axios from "axios";
import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import UserLogo from "../../assets/Profile.png";
import { Edit, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const getAllUsers = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      const res = await axios.get(
        "http://localhost:8000/api/v1/user/all-users",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        setUsers(res.data.users);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const filteredUsers = users.filter((user) => {
    const fullName = `${user?.firstName || ""} ${
      user?.lastName || ""
    }`.toLowerCase();

    return (
      fullName.includes(search.toLowerCase()) ||
      user?.email?.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="pl-[350px] py-20 pr-20 min-h-screen bg-gray-100 font-serif">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-bold text-3xl text-gray-800">User Management</h1>

        <p className="mt-2 text-gray-500">
          View and manage all registered users
        </p>
      </div>

      {/* Search */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
        <div className="flex items-center justify-between">
          <div className="relative w-full max-w-md">
            <Search
              className="
                absolute
                left-3
                top-1/2
                -translate-y-1/2
                text-gray-400
                w-5
                h-5
              "
            />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="
                w-full
                h-11
                pl-10
                pr-4
                rounded-lg
                border
                border-gray-300
                bg-gray-50
                text-gray-800
                outline-none
                focus:border-orange-500
                focus:ring-2
                focus:ring-orange-100
              "
              placeholder="Search users..."
            />
          </div>

          <div className="bg-orange-50 border border-orange-200 rounded-lg px-5 py-2 text-center">
            <p className="text-xs text-gray-500">Total Users</p>

            <p className="text-xl font-bold text-orange-600">{users.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-7">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => {
            return (
              <div
                key={user._id}
                className="
                  bg-white
                  rounded-xl
                  border
                  border-gray-200
                  shadow-sm
                  p-5
                  hover:shadow-lg
                  hover:-translate-y-1
                  transition-all
                  duration-200
                "
              >

                <div className="flex items-center gap-4">
                  <img
                    src={user?.profilePic || UserLogo}
                    alt={`${user?.firstName || "User"} profile`}
                    className="
                      w-16
                      h-16
                      rounded-full
                      object-cover
                      border-2
                      border-orange-200
                      bg-gray-100
                    "
                  />

                  <div className="min-w-0">
                    <h2 className="font-bold text-lg text-gray-800 truncate">
                      {user?.firstName} {user?.lastName}
                    </h2>

                    <p className="text-sm text-gray-500 truncate">
                      {user?.email}
                    </p>
                  </div>
                </div>

                {/* User Details */}
                <div className="mt-5 pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">Phone</span>

                    <span className="text-gray-800 text-sm">
                      {user?.phoneNo || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-gray-500 text-sm">City</span>

                    <span className="text-gray-800 text-sm">
                      {user?.city || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 text-sm">Role</span>

                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-xs
                        font-semibold
                        ${
                          user?.role === "admin"
                            ? "bg-red-100 text-red-600"
                            : "bg-green-100 text-green-600"
                        }
                      `}
                    >
                      {user?.role || "user"}
                    </span>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <Button
                      onClick={() => navigate(`/dashboard/users/${user?._id}`)}
                      variant="outline"
                      className="flex-1 border-green-500 text-green-600 hover:bg-green-50 hover:text-green-700 cursor-pointer"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate(`/dashboard/users/orders/${user._id}`)
                      }
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Show Order
                    </Button>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="col-span-full bg-white rounded-xl p-12 text-center border border-gray-200">
            <p className="text-gray-500 text-lg">No users found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUsers;
