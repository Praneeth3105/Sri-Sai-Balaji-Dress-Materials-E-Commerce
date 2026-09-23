import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import axios from "axios";

import {
  Search,
  Edit,
  Eye,
  Users,
  UserRound,
  Mail,
  Phone,
  MapPin,
  Sparkles,
  RefreshCw,
} from "lucide-react";

import React, { useEffect, useState } from "react";

import UserLogo from "../../assets/Profile.png";

import { useNavigate } from "react-router-dom";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // =========================================================
  // GET ALL USERS
  // =========================================================

  const getAllUsers = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      setLoading(true);

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/user/all-users`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        setUsers(res.data.users || []);
      }
    } catch (error) {
      console.log("GET USERS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  // =========================================================
  // FILTER USERS
  // =========================================================

  const filteredUsers = users.filter((user) => {
    const fullName = `${user?.firstName || ""} ${
      user?.lastName || ""
    }`.toLowerCase();

    const searchValue = search.toLowerCase();

    return (
      fullName.includes(searchValue) ||
      user?.email?.toLowerCase().includes(searchValue)
    );
  });

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f4ee] pl-0 md:pl-[300px] pt-24 px-6">
        <div className="max-w-[1350px] mx-auto animate-pulse">
          <div className="h-4 w-28 bg-[#e5d9ca] rounded mb-4" />

          <div className="h-14 w-80 bg-[#e5d9ca] rounded mb-10" />

          <div className="h-20 bg-[#fffdf9] border border-[#e5d9ca] rounded-2xl mb-7" />

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div
                key={item}
                className="h-72 bg-[#fffdf9] border border-[#e5d9ca] rounded-2xl"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f4ee] text-[#3d3028] pl-0 md:pl-[300px] pt-[125px] pb-24">
      {/* =====================================================
          DECORATIVE BACKGROUND
      ====================================================== */}

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 right-0 w-[500px] h-[500px] rounded-full bg-[#ead8bd]/30 blur-3xl" />

        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-[#ead6d0]/20 blur-3xl" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10">
        {/* ===================================================
            HEADER
        ==================================================== */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Users className="w-4 h-4 text-[#a78352]" strokeWidth={1.5} />

              <span className="text-[10px] uppercase tracking-[0.3em] text-[#a78352] font-semibold">
                Customer Management
              </span>
            </div>

            <h1 className="font-[Cormorant_Garamond] text-5xl md:text-6xl text-[#382b24] leading-none">
              User
              <span className="italic text-[#a78352]"> Management</span>
            </h1>

            <div className="w-12 h-px bg-[#b99a6b] mt-5 mb-4" />

            <p className="text-sm text-[#7b6d64] max-w-xl">
              View and manage the customers registered with your store.
            </p>
          </div>

          {/* Total Users */}
          <div className="flex items-center gap-4 bg-[#fffdf9] border border-[#e5d9ca] rounded-2xl px-5 py-4 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-[#eee5da] flex items-center justify-center">
              <Users className="w-4 h-4 text-[#a78352]" strokeWidth={1.5} />
            </div>

            <div>
              <p className="text-[9px] uppercase tracking-[0.2em] text-[#8c7d73]">
                Total Users
              </p>

              <p className="font-[Cormorant_Garamond] text-2xl text-[#44352c]">
                {users.length}
              </p>
            </div>
          </div>
        </div>

        {/* ===================================================
            SEARCH BAR
        ==================================================== */}

        <div className="bg-[#fffdf9] border border-[#e5d9ca] rounded-[1.5rem] p-5 shadow-sm mb-7">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative w-full max-w-xl">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#9b8a7d] w-4 h-4"
                strokeWidth={1.5}
              />

              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-xl border-[#ded1c2] bg-[#faf7f2] text-[#44352c] placeholder:text-[#a2958c] focus-visible:border-[#b99a6b] focus-visible:ring-[#b99a6b]"
                placeholder="Search by name or email..."
              />
            </div>

            <Button
              type="button"
              variant="outline"
              onClick={getAllUsers}
              className="h-12 rounded-xl border-[#d8c9b8] bg-[#faf7f2] text-[#66564a] hover:bg-[#eee5da] cursor-pointer"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* ===================================================
            USER CARDS
        ==================================================== */}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => {
              const isAdmin = user?.role === "admin";

              return (
                <div
                  key={user._id}
                  className="group bg-[#fffdf9] rounded-[1.5rem] border border-[#e5d9ca] shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
                >
                  {/* =================================================
                      USER HEADER
                  ================================================== */}

                  <div className="flex items-center gap-4">
                    <div className="relative shrink-0">
                      <div className="w-[68px] h-[68px] rounded-full bg-[#eee5da] overflow-hidden border-2 border-[#d9c4a6] p-0.5">
                        <img
                          src={user?.profilePic || UserLogo}
                          alt={`${user?.firstName || "User"} profile`}
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>

                      <div
                        className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-[#fffdf9] flex items-center justify-center ${
                          isAdmin ? "bg-[#8a5148]" : "bg-[#71836b]"
                        }`}
                      >
                        <UserRound
                          className="w-3 h-3 text-white"
                          strokeWidth={1.8}
                        />
                      </div>
                    </div>

                    <div className="min-w-0">
                      <h2 className="font-[Cormorant_Garamond] text-2xl text-[#44352c] truncate">
                        {user?.firstName || "User"} {user?.lastName || ""}
                      </h2>

                      <p className="text-xs text-[#8a7c72] truncate flex items-center gap-1.5 mt-1">
                        <Mail className="w-3 h-3 shrink-0" />

                        {user?.email || "No email"}
                      </p>
                    </div>
                  </div>

                  {/* =================================================
                      DETAILS
                  ================================================== */}

                  <div className="mt-6 pt-5 border-t border-[#eadfd3] space-y-3">
                    {/* Phone */}
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2 text-xs text-[#88786d]">
                        <Phone
                          className="w-3.5 h-3.5 text-[#a78352]"
                          strokeWidth={1.5}
                        />
                        Phone
                      </span>

                      <span className="text-xs text-[#4f433b] truncate max-w-[170px]">
                        {user?.phoneNo || "N/A"}
                      </span>
                    </div>

                    {/* City */}
                    <div className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-2 text-xs text-[#88786d]">
                        <MapPin
                          className="w-3.5 h-3.5 text-[#a78352]"
                          strokeWidth={1.5}
                        />
                        City
                      </span>

                      <span className="text-xs text-[#4f433b]">
                        {user?.city || "N/A"}
                      </span>
                    </div>

                    {/* Role */}
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs text-[#88786d]">Role</span>

                      <span
                        className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-wider font-semibold border ${
                          isAdmin
                            ? "bg-[#f2e0dc] text-[#8a5148] border-[#e3c8c2]"
                            : "bg-[#e7efe8] text-[#4f6b56] border-[#cfddcf]"
                        }`}
                      >
                        {user?.role || "user"}
                      </span>
                    </div>
                  </div>

                  {/* =================================================
                      ACTIONS
                  ================================================== */}

                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={() => navigate(`/dashboard/users/${user?._id}`)}
                      variant="outline"
                      className="flex-1 h-10 rounded-full border-[#cdb690] text-[#80644a] hover:bg-[#eee5da] hover:text-[#4a382c] cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5 mr-2" />
                      Edit
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() =>
                        navigate(`/dashboard/users/orders/${user._id}`)
                      }
                      className="flex-1 h-10 rounded-full border-[#d8c9b8] text-[#66564a] hover:bg-[#eee5da] hover:text-[#4a382c] cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5 mr-2" />
                      Orders
                    </Button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full bg-[#fffdf9] rounded-[1.5rem] p-16 text-center border border-[#e5d9ca]">
              <div className="w-16 h-16 rounded-full bg-[#eee5da] flex items-center justify-center mx-auto mb-5">
                <Search className="w-7 h-7 text-[#a78352]" strokeWidth={1.4} />
              </div>

              <h3 className="font-[Cormorant_Garamond] text-3xl text-[#44352c]">
                No Users Found
              </h3>

              <p className="text-sm text-[#7b6d64] mt-2">
                Try searching with a different name or email.
              </p>
            </div>
          )}
        </div>

        {/* ===================================================
            FOOTER
        ==================================================== */}
        <div className="text-center mt-12 pb-6">
          <div className="flex items-center justify-center gap-3">
            <span className="w-10 h-px bg-[#d5c4ad]" />

            <Sparkles
              className="w-3.5 h-3.5 text-[#b99a6b]"
              strokeWidth={1.4}
            />

            <span className="w-10 h-px bg-[#d5c4ad]" />
          </div>

          <p className="font-[Cormorant_Garamond] italic text-lg text-[#9a784e] mt-3">
            Style that feels like you.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminUsers;
