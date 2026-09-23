import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import {
  ArrowLeft,
  Camera,
  Loader2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";

const UserInfo = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [file, setFile] = useState(null);
  const [profileImage, setProfileImage] = useState("/Profile.png");

  const [updateUser, setUpdateUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    zipCode: "",
    role: "user",
  });

  const getUser = async () => {
    try {
      setPageLoading(true);

      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      if (!id) {
        toast.error("User ID not found");
        return;
      }

      const res = await axios.get(
        `${import.meta.env.VITE_URL}/api/v1/user/get-user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        const user = res.data.user;

        setUpdateUser({
          firstName: user?.firstName || "",
          lastName: user?.lastName || "",
          email: user?.email || "",
          phoneNo: user?.phoneNo || "",
          address: user?.address || "",
          city: user?.city || "",
          zipCode: user?.zipCode || "",
          role: user?.role || "user",
        });

        setProfileImage(user?.profilePic || "/Profile.png");
      }
    } catch (error) {
      console.log("GET USER ERROR:", error);

      toast.error(error?.response?.data?.message || "Failed to load profile");
    } finally {
      setPageLoading(false);
    }
  };

  useEffect(() => {
    getUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUpdateUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleChange = (e) => {
    setUpdateUser((prev) => ({
      ...prev,
      role: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files?.[0];

    if (!selectedFile) return;

    setFile(selectedFile);

    const preview = URL.createObjectURL(selectedFile);
    setProfileImage(preview);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const accessToken = localStorage.getItem("accessToken");

      if (!accessToken) {
        toast.error("Please login again");
        navigate("/login");
        return;
      }

      const formData = new FormData();

      formData.append("firstName", updateUser.firstName);
      formData.append("lastName", updateUser.lastName);
      formData.append("email", updateUser.email);
      formData.append("phoneNo", updateUser.phoneNo);
      formData.append("address", updateUser.address);
      formData.append("city", updateUser.city);
      formData.append("zipCode", updateUser.zipCode);
      formData.append("role", updateUser.role);

      if (file) {
        formData.append("file", file);
      }

      const res = await axios.put(
        `${import.meta.env.VITE_URL}/api/v1/user/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message || "Profile updated successfully");

        const user = res.data.user;

        if (user) {
          setUpdateUser({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phoneNo: user.phoneNo || "",
            address: user.address || "",
            city: user.city || "",
            zipCode: user.zipCode || "",
            role: user.role || "user",
          });

          setProfileImage(user.profilePic || "/Profile.png");
        }

        setFile(null);
      }
    } catch (error) {
      console.log("UPDATE USER ERROR:", error);

      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="md:pl-[300px] min-h-screen bg-[#f8f4ee] flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-full bg-[#eee5da] flex items-center justify-center mx-auto">
            <Loader2 className="w-7 h-7 animate-spin text-[#a78352]" />
          </div>

          <p className="mt-4 font-[DM_Sans] text-sm text-[#7b6d64]">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="md:pl-[300px] min-h-screen bg-[#f8f4ee] pt-24 pb-12 px-5 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="
              w-11 h-11 rounded-full
              border-[#e5d9ca]
              bg-[#fffdf9]
              text-[#4a382c]
              hover:bg-[#eee5da]
              hover:text-[#35271f]
              cursor-pointer
            "
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div>
            <p className="text-xs uppercase tracking-[0.22em] text-[#a78352] font-[DM_Sans] font-semibold">
              Admin Panel
            </p>

            <h1 className="mt-1 text-3xl md:text-4xl font-[Cormorant_Garamond] font-semibold text-[#35271f]">
              Update Profile
            </h1>

            <p className="text-sm text-[#7b6d64] font-[DM_Sans] mt-1">
              Manage user information and account access
            </p>
          </div>
        </div>

        {/* MAIN CARD */}
        <form
          onSubmit={handleSubmit}
          className="
            bg-[#fffdf9]
            border border-[#e5d9ca]
            rounded-3xl
            overflow-hidden
            shadow-[0_18px_50px_rgba(74,56,44,0.08)]
          "
        >
          <div className="grid lg:grid-cols-[280px_1fr]">
            {/* PROFILE SIDE */}
            <div className="bg-[#f4efe7] p-8 lg:p-10 flex flex-col items-center border-b lg:border-b-0 lg:border-r border-[#e5d9ca]">
              <div className="relative">
                <div className="w-36 h-36 rounded-full bg-[#fffdf9] p-1.5 shadow-md">
                  <img
                    src={profileImage || "/Profile.png"}
                    alt="Profile"
                    className="
                      w-full
                      h-full
                      rounded-full
                      object-cover
                    "
                  />
                </div>

                <input
                  type="file"
                  id="profilePicture"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />

                <label
                  htmlFor="profilePicture"
                  className="
                    absolute
                    bottom-1
                    right-1
                    w-10
                    h-10
                    rounded-full
                    bg-[#4a382c]
                    text-[#f7ead8]
                    flex
                    items-center
                    justify-center
                    cursor-pointer
                    border-4
                    border-[#f4efe7]
                    hover:bg-[#35271f]
                    transition
                  "
                >
                  <Camera className="w-4 h-4" />
                </label>
              </div>

              <h2 className="mt-6 text-xl font-[Cormorant_Garamond] font-semibold text-[#35271f] text-center">
                {updateUser.firstName} {updateUser.lastName}
              </h2>

              <p className="mt-1 text-sm text-[#7b6d64] text-center break-all font-[DM_Sans]">
                {updateUser.email}
              </p>

              {/* ROLE */}
              <div className="mt-5 flex items-center gap-2 px-4 py-2 rounded-full bg-[#fffdf9] border border-[#e5d9ca]">
                <ShieldCheck className="w-4 h-4 text-[#a78352]" />

                <span className="text-xs font-semibold uppercase tracking-wider text-[#4a382c]">
                  {updateUser.role}
                </span>
              </div>

              <div className="w-full mt-8 pt-6 border-t border-[#dfd2c5]">
                <div className="flex items-center gap-3 text-[#7b6d64]">
                  <div className="w-9 h-9 rounded-full bg-[#fffdf9] flex items-center justify-center">
                    <UserRound className="w-4 h-4 text-[#a78352]" />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider">
                      Account
                    </p>

                    <p className="text-sm text-[#4a382c] font-medium">
                      Registered User
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-[11px] leading-5 text-center text-[#8b7d73]">
                Click the camera icon to update the user's profile picture.
              </p>
            </div>

            {/* FORM SIDE */}
            <div className="p-7 md:p-10">
              {/* PERSONAL */}
              <div className="mb-8">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-full bg-[#eee5da] flex items-center justify-center">
                    <UserRound className="w-4 h-4 text-[#a78352]" />
                  </div>

                  <div>
                    <h2 className="text-xl font-[Cormorant_Garamond] font-semibold text-[#35271f]">
                      Personal Information
                    </h2>

                    <p className="text-xs text-[#8b7d73] font-[DM_Sans]">
                      Basic account details
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="grid gap-2">
                    <Label className="text-[#4a382c] font-[DM_Sans]">
                      First Name
                    </Label>

                    <Input
                      name="firstName"
                      value={updateUser.firstName}
                      onChange={handleChange}
                      className="
                        h-11
                        border-[#e5d9ca]
                        bg-[#fffdf9]
                        rounded-xl
                        focus-visible:ring-[#b99a6b]
                      "
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label className="text-[#4a382c] font-[DM_Sans]">
                      Last Name
                    </Label>

                    <Input
                      name="lastName"
                      value={updateUser.lastName}
                      onChange={handleChange}
                      className="
                        h-11
                        border-[#e5d9ca]
                        bg-[#fffdf9]
                        rounded-xl
                        focus-visible:ring-[#b99a6b]
                      "
                    />
                  </div>
                </div>
              </div>

              {/* CONTACT */}
              <div className="mb-8 pt-7 border-t border-[#eadfd3]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-full bg-[#eee5da] flex items-center justify-center">
                    <Mail className="w-4 h-4 text-[#a78352]" />
                  </div>

                  <div>
                    <h2 className="text-xl font-[Cormorant_Garamond] font-semibold text-[#35271f]">
                      Contact Information
                    </h2>

                    <p className="text-xs text-[#8b7d73] font-[DM_Sans]">
                      Email and contact details
                    </p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="grid gap-2">
                    <Label className="flex gap-2 items-center text-[#4a382c]">
                      <Mail className="w-4 h-4 text-[#a78352]" />
                      Email
                    </Label>

                    <Input
                      name="email"
                      value={updateUser.email}
                      disabled
                      className="
                        h-11
                        rounded-xl
                        bg-[#f4efe7]
                        border-[#e5d9ca]
                        text-[#8b7d73]
                      "
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label className="flex gap-2 items-center text-[#4a382c]">
                      <Phone className="w-4 h-4 text-[#a78352]" />
                      Phone
                    </Label>

                    <Input
                      name="phoneNo"
                      value={updateUser.phoneNo}
                      onChange={handleChange}
                      className="
                        h-11
                        border-[#e5d9ca]
                        bg-[#fffdf9]
                        rounded-xl
                        focus-visible:ring-[#b99a6b]
                      "
                    />
                  </div>
                </div>
              </div>

              {/* ADDRESS */}
              <div className="mb-8 pt-7 border-t border-[#eadfd3]">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-9 h-9 rounded-full bg-[#eee5da] flex items-center justify-center">
                    <MapPin className="w-4 h-4 text-[#a78352]" />
                  </div>

                  <div>
                    <h2 className="text-xl font-[Cormorant_Garamond] font-semibold text-[#35271f]">
                      Address
                    </h2>

                    <p className="text-xs text-[#8b7d73] font-[DM_Sans]">
                      Delivery and location information
                    </p>
                  </div>
                </div>

                <div className="grid gap-5">
                  <div className="grid gap-2">
                    <Label className="text-[#4a382c]">Address</Label>

                    <Input
                      name="address"
                      value={updateUser.address}
                      onChange={handleChange}
                      className="
                        h-11
                        border-[#e5d9ca]
                        bg-[#fffdf9]
                        rounded-xl
                        focus-visible:ring-[#b99a6b]
                      "
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="grid gap-2">
                      <Label className="text-[#4a382c]">City</Label>

                      <Input
                        name="city"
                        value={updateUser.city}
                        onChange={handleChange}
                        className="
                          h-11
                          border-[#e5d9ca]
                          bg-[#fffdf9]
                          rounded-xl
                          focus-visible:ring-[#b99a6b]
                        "
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label className="text-[#4a382c]">Zip Code</Label>

                      <Input
                        name="zipCode"
                        value={updateUser.zipCode}
                        onChange={handleChange}
                        className="
                          h-11
                          border-[#e5d9ca]
                          bg-[#fffdf9]
                          rounded-xl
                          focus-visible:ring-[#b99a6b]
                        "
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ROLE */}
              <div className="pt-7 border-t border-[#eadfd3]">
                <div className="p-5 rounded-2xl bg-[#f4efe7] border border-[#e5d9ca]">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-[#a78352]" />

                    <div>
                      <p className="font-semibold text-[#35271f]">User Role</p>

                      <p className="text-xs text-[#8b7d73] mt-0.5">
                        Control the account access level
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-8 mt-5">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="user"
                        checked={updateUser.role === "user"}
                        onChange={handleRoleChange}
                        className="w-4 h-4 accent-[#4a382c]"
                      />

                      <span className="text-sm text-[#4a382c]">User</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={updateUser.role === "admin"}
                        onChange={handleRoleChange}
                        className="w-4 h-4 accent-[#4a382c]"
                      />

                      <span className="text-sm text-[#4a382c]">Admin</span>
                    </label>
                  </div>
                </div>

                {/* UPDATE */}
                <Button
                  type="submit"
                  disabled={loading}
                  className="
                    w-full
                    mt-6
                    h-12
                    rounded-xl
                    bg-[#4a382c]
                    hover:bg-[#35271f]
                    text-[#fffdf9]
                    font-[DM_Sans]
                    font-semibold
                    cursor-pointer
                    shadow-[0_10px_25px_rgba(74,56,44,0.15)]
                  "
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Updating Profile...
                    </span>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserInfo;
