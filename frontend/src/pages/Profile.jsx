import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Camera, User, ShoppingBag, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import axios from "axios";
import { setUser } from "@/redux/UserSlice";
import MyOrder from "./MyOrder";

const Profile = () => {
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [profileImage, setProfileImage] = useState(
    user?.profilePic || "/Profile.png",
  );

  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phoneNo: user?.phoneNo || "",
    address: user?.address || "",
    city: user?.city || "",
    zipCode: user?.zipCode || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUpdateUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);

    const imageUrl = URL.createObjectURL(selectedFile);

    setProfileImage(imageUrl);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const accessToken = localStorage.getItem("accessToken");

      if (!user?._id) {
        toast.error("User ID not found");
        return;
      }

      if (!accessToken) {
        toast.error("Please login again");
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
      if (file) {
        formData.append("file", file);
      }

      const res = await axios.put(
        `http://localhost:8000/api/v1/user/update/${user._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );

      console.log("UPDATE RESPONSE:", res.data);

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        setProfileImage(res.data.user.profilePic || "/Profile.png");
        setUpdateUser({
          firstName: res.data.user.firstName || "",
          lastName: res.data.user.lastName || "",
          email: res.data.user.email || "",
          phoneNo: res.data.user.phoneNo || "",
          address: res.data.user.address || "",
          city: res.data.user.city || "",
          zipCode: res.data.user.zipCode || "",
        });
        setFile(null);
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log("UPDATE PROFILE ERROR:", error);

      console.log("SERVER RESPONSE:", error?.response?.data);

      toast.error(error?.response?.data?.message || "Failed to Update Profile");
    } finally {
      setLoading(false);
    }
  };

  const fullName =
    `${updateUser.firstName} ${updateUser.lastName}`.trim() || "Your Name";

  return (
    <div className="pt-20 min-h-screen bg-orange-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-orange-600 font-semibold mb-2">
            Sri Sai Balaji Dress Materials
          </p>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-gray-900">
            Your Account
          </h1>
        </div>
        <div className="flex justify-center mb-10">
          <div className="bg-white border border-orange-100 rounded-full p-1 shadow-sm flex">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-serif text-sm cursor-pointer transition ${
                activeTab === "profile"
                  ? "bg-orange-500 text-white"
                  : "text-gray-600 hover:bg-orange-50"
              }`}
            >
              <User className="w-4 h-4" />
              Profile
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-serif text-sm cursor-pointer transition ${
                activeTab === "orders"
                  ? "bg-orange-500 text-white"
                  : "text-gray-600 hover:bg-orange-50"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Orders
            </button>
          </div>
        </div>
        {activeTab === "profile" && (
          <form
            onSubmit={handleSubmit}
            className="bg-white rounded-2xl shadow-sm border border-orange-100 overflow-hidden"
          >
            <div className="grid md:grid-cols-[240px_1fr]">
              <div className="bg-orange-50 border-b md:border-b-0 md:border-r border-orange-100 px-6 py-10 flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-orange-400 bg-orange-100">
                    <img
                      src={profileImage || "/Profile.png"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <input
                    id="profilePicture"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  <label
                    htmlFor="profilePicture"
                    className="absolute -bottom-1 -right-1 bg-orange-500 hover:bg-orange-600 text-white w-9 h-9 rounded-full cursor-pointer flex items-center justify-center shadow-sm"
                  >
                    <Camera className="w-4 h-4" />
                  </label>
                </div>

                <p className="mt-5 font-serif text-lg text-gray-900">
                  {fullName}
                </p>

                <p className="text-xs text-gray-500 mt-1">{updateUser.email}</p>
              </div>
              <div className="px-6 py-8 md:px-10 md:py-10">
                <div className="mb-8">
                  <h2 className="text-xs tracking-[0.2em] uppercase text-orange-600 font-semibold mb-5">
                    Personal Details
                  </h2>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="grid gap-2">
                      <Label htmlFor="firstName">First Name</Label>

                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        value={updateUser.firstName}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="lastName">Last Name</Label>

                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        value={updateUser.lastName}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-dashed border-orange-200 mb-8" />

                <div className="mb-8">
                  <h2 className="text-xs tracking-[0.2em] uppercase text-orange-600 font-semibold mb-5">
                    Contact
                  </h2>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="email"
                        className="flex items-center gap-2"
                      >
                        <Mail className="w-4 h-4 text-orange-500" />
                        Email
                      </Label>

                      <Input
                        id="email"
                        name="email"
                        type="email"
                        disabled
                        value={updateUser.email}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="phoneNo"
                        className="flex items-center gap-2"
                      >
                        <Phone className="w-4 h-4 text-orange-500" />
                        Phone Number
                      </Label>

                      <Input
                        id="phoneNo"
                        name="phoneNo"
                        type="tel"
                        value={updateUser.phoneNo}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t border-dashed border-orange-200 mb-8" />

                <div className="mb-8">
                  <h2 className="text-xs tracking-[0.2em] uppercase text-orange-600 font-semibold mb-5 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-orange-500" />
                    Delivery Address
                  </h2>

                  <div className="grid gap-5">
                    <div className="grid gap-2">
                      <Label htmlFor="address">Address</Label>

                      <Input
                        id="address"
                        name="address"
                        type="text"
                        value={updateUser.address}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="grid gap-2">
                        <Label htmlFor="city">City</Label>

                        <Input
                          id="city"
                          name="city"
                          type="text"
                          value={updateUser.city}
                          onChange={handleChange}
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="zipCode">Zip Code</Label>

                        <Input
                          id="zipCode"
                          name="zipCode"
                          type="text"
                          value={updateUser.zipCode}
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Update */}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-serif cursor-pointer py-3 rounded-lg"
                >
                  {loading ? "Updating..." : "Update Profile"}
                </Button>
              </div>
            </div>
          </form>
        )}

        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl shadow-sm border border-orange-100 p-6 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-orange-50 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-orange-500" />
              </div>

              <div>
                <h2 className="text-2xl font-bold font-serif">Your Orders</h2>

                <p className="text-sm text-gray-500">
                  Track your previous purchases
                </p>
              </div>
            </div>
            <MyOrder />
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
