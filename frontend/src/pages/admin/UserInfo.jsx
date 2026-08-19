import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import { ArrowLeft, Camera, Loader2, Mail, MapPin, Phone } from "lucide-react";
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
        `http://localhost:8000/api/v1/user/get-user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log("GET USER:", res.data);

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
      console.log("ERROR RESPONSE:", error?.response?.data);

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

      console.log("Updating user:", updateUser);

      const res = await axios.put(
        `http://localhost:8000/api/v1/user/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log("UPDATE RESPONSE:", res.data);

      if (res.data.success) {
        toast.success(res.data.message || "Profile Updated Successfully");
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
      console.log("UPDATE ERROR:", error);

      console.log("SERVER ERROR:", error?.response?.data);

      toast.error(error?.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="pl-[350px] min-h-screen bg-orange-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 animate-spin text-orange-600 mx-auto" />

          <p className="mt-3 font-serif text-gray-600">Loading Profile...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="pl-[350px] py-20 pr-20 min-h-screen bg-orange-50">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate(-1)}
            className="w-10 h-10 rounded-full cursor-pointer"
          >
            <ArrowLeft />
          </Button>

          <div>
            <p className="text-sm text-orange-600 font-semibold">ADMIN PANEL</p>

            <h1 className="text-3xl font-bold font-serif text-gray-800">
              Update Profile
            </h1>

            <p className="text-gray-500 font-serif">Update user information</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl shadow-lg border border-orange-100 overflow-hidden"
        >
          <div className="grid md:grid-cols-[240px_1fr]">
            <div className="bg-orange-50 p-8 flex flex-col items-center border-r border-orange-100">
              <div className="relative">
                <img
                  src={profileImage || "/Profile.png"}
                  alt="Profile"
                  className="
                    w-32
                    h-32
                    rounded-full
                    object-cover
                    border-4
                    border-orange-400
                  "
                />

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
                    bottom-0
                    right-0
                    w-9
                    h-9
                    rounded-full
                    bg-orange-600
                    text-white
                    flex
                    items-center
                    justify-center
                    cursor-pointer
                    hover:bg-orange-700
                  "
                >
                  <Camera className="w-4 h-4" />
                </label>
              </div>

              <h2 className="mt-5 text-lg font-bold text-gray-800">
                {updateUser.firstName} {updateUser.lastName}
              </h2>

              <p className="text-sm text-gray-500 text-center break-all">
                {updateUser.email}
              </p>

              <div className="mt-4 px-4 py-2 rounded-full bg-white border border-orange-200">
                <span className="text-sm font-semibold text-orange-600 capitalize">
                  {updateUser.role}
                </span>
              </div>
            </div>

            <div className="p-8">
              <h2 className="text-lg font-bold font-serif text-gray-800 mb-5">
                Personal Information
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="grid gap-2">
                  <Label>First Name</Label>

                  <Input
                    name="firstName"
                    value={updateUser.firstName}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>

                <div className="grid gap-2">
                  <Label>Last Name</Label>

                  <Input
                    name="lastName"
                    value={updateUser.lastName}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>
              </div>

              <h2 className="text-lg font-bold font-serif text-gray-800 mt-8 mb-5">
                Contact Information
              </h2>

              <div className="grid md:grid-cols-2 gap-5">
                <div className="grid gap-2">
                  <Label className="flex gap-2 items-center">
                    <Mail className="w-4 h-4 text-orange-500" />
                    Email
                  </Label>

                  <Input
                    name="email"
                    value={updateUser.email}
                    disabled
                    className="h-11 bg-gray-100"
                  />
                </div>

                <div className="grid gap-2">
                  <Label className="flex gap-2 items-center">
                    <Phone className="w-4 h-4 text-orange-500" />
                    Phone
                  </Label>

                  <Input
                    name="phoneNo"
                    value={updateUser.phoneNo}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>
              </div>

              <h2 className="text-lg font-bold font-serif text-gray-800 mt-8 mb-5 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-orange-500" />
                Address
              </h2>

              <div className="grid gap-5">
                <div className="grid gap-2">
                  <Label>Address</Label>

                  <Input
                    name="address"
                    value={updateUser.address}
                    onChange={handleChange}
                    className="h-11"
                  />
                </div>

                <div className="grid md:grid-cols-2 gap-5">
                  <div className="grid gap-2">
                    <Label>City</Label>

                    <Input
                      name="city"
                      value={updateUser.city}
                      onChange={handleChange}
                      className="h-11"
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label>Zip Code</Label>

                    <Input
                      name="zipCode"
                      value={updateUser.zipCode}
                      onChange={handleChange}
                      className="h-11"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-8 p-5 rounded-xl bg-orange-50 border border-orange-200">
                <Label className="font-bold text-gray-800">User Role</Label>

                <div className="flex gap-8 mt-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      checked={updateUser.role === "user"}
                      onChange={handleRoleChange}
                      className="w-4 h-4 accent-orange-600"
                    />

                    <span>User</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      checked={updateUser.role === "admin"}
                      onChange={handleRoleChange}
                      className="w-4 h-4 accent-orange-600"
                    />

                    <span>Admin</span>
                  </label>
                </div>
              </div>
              <Button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  mt-8
                  h-12
                  bg-orange-600
                  hover:bg-orange-700
                  text-white
                  font-serif
                  font-semibold
                  cursor-pointer
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
        </form>
      </div>
    </div>
  );
};

export default UserInfo;
