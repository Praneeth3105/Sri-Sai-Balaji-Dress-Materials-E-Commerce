import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Camera,
  User,
  ShoppingBag,
  Mail,
  Phone,
  MapPin,
  Save,
  ChevronRight,
} from "lucide-react";
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

  // =========================
  // INPUT CHANGE
  // =========================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setUpdateUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // PROFILE IMAGE
  // =========================
  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);

    const imageUrl = URL.createObjectURL(selectedFile);
    setProfileImage(imageUrl);
  };

  // =========================
  // UPDATE PROFILE
  // =========================
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
        `${import.meta.env.VITE_URL}/api/v1/user/update/${user._id}`,
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

        toast.success(res.data.message || "Profile updated successfully");
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
    <div className="min-h-screen bg-[#f8f4ee] text-[#3d3028] pt-20">
      {/* =====================================================
          PAGE HEADER
      ====================================================== */}
      <section className="relative overflow-hidden px-6 pt-12 pb-14 md:pt-16 md:pb-16">
        {/* Decorative background */}
        <div className="absolute -top-28 -left-24 w-72 h-72 rounded-full bg-[#ead8bd]/40 blur-3xl" />

        <div className="absolute -top-20 -right-28 w-80 h-80 rounded-full bg-[#e7d0c8]/30 blur-3xl" />

        <div className="relative max-w-6xl mx-auto text-center">
          <p className="text-[10px] md:text-xs uppercase tracking-[0.35em] text-[#a78352] font-semibold mb-3">
            Sri Sai Balaji Dress Materials
          </p>

          <h1 className="font-[Cormorant_Garamond] text-5xl md:text-6xl text-[#382b24] leading-none">
            Your
            <span className="italic text-[#a78352]"> Account</span>
          </h1>

          <div className="w-12 h-px bg-[#b99a6b] mx-auto mt-5" />

          <p className="text-sm text-[#7b6d64] mt-5">
            Manage your personal details and keep track of your orders.
          </p>
        </div>
      </section>

      {/* =====================================================
          TABS
      ====================================================== */}
      <div className="px-6 pb-8">
        <div className="max-w-6xl mx-auto flex justify-center">
          <div className="inline-flex items-center gap-1 bg-[#fffdf9] border border-[#e5d9ca] rounded-full p-1.5 shadow-sm">
            {/* Profile */}
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-5 md:px-7 py-2.5 rounded-full text-sm transition-all duration-300 cursor-pointer ${
                activeTab === "profile"
                  ? "bg-[#4a382c] text-white shadow-md"
                  : "text-[#6f6259] hover:bg-[#f2e9de]"
              }`}
            >
              <User className="w-4 h-4" strokeWidth={1.7} />

              <span>Profile</span>
            </button>

            {/* Orders */}
            <button
              type="button"
              onClick={() => setActiveTab("orders")}
              className={`flex items-center gap-2 px-5 md:px-7 py-2.5 rounded-full text-sm transition-all duration-300 cursor-pointer ${
                activeTab === "orders"
                  ? "bg-[#4a382c] text-white shadow-md"
                  : "text-[#6f6259] hover:bg-[#f2e9de]"
              }`}
            >
              <ShoppingBag className="w-4 h-4" strokeWidth={1.7} />

              <span>Orders</span>
            </button>
          </div>
        </div>
      </div>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}
      <div className="max-w-6xl mx-auto px-6 pb-24">
        {/* ===================================================
            PROFILE TAB
        ==================================================== */}
        {activeTab === "profile" && (
          <form onSubmit={handleSubmit}>
            <div className="bg-[#fffdf9] border border-[#e5d9ca] rounded-[1.75rem] overflow-hidden shadow-sm">
              <div className="grid lg:grid-cols-[280px_1fr]">
                {/* ==========================================
                    PROFILE SIDEBAR
                =========================================== */}
                <div className="relative bg-[#eee5da] border-b lg:border-b-0 lg:border-r border-[#e2d4c4] px-7 py-10">
                  {/* Decorative circle */}
                  <div className="absolute -top-20 -left-20 w-48 h-48 rounded-full border border-[#b99a6b]/20" />

                  <div className="relative flex flex-col items-center text-center">
                    {/* Profile Image */}
                    <div className="relative">
                      <div className="absolute inset-[-7px] rounded-full border border-[#b99a6b]/50" />

                      <div className="relative w-32 h-32 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-[#fffdf9] bg-[#e4d5c2] shadow-lg">
                        <img
                          src={profileImage || "/Profile.png"}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Upload */}
                      <input
                        id="profilePicture"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageChange}
                      />

                      <label
                        htmlFor="profilePicture"
                        className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-[#4a382c] hover:bg-[#35271f] text-white flex items-center justify-center cursor-pointer shadow-lg transition-colors"
                      >
                        <Camera className="w-4 h-4" strokeWidth={1.7} />
                      </label>
                    </div>

                    {/* Name */}
                    <h2 className="font-[Cormorant_Garamond] text-2xl text-[#3e3028] mt-7">
                      {fullName}
                    </h2>

                    <p className="text-xs text-[#81736a] mt-1 break-all">
                      {updateUser.email}
                    </p>

                    <div className="w-10 h-px bg-[#b99a6b] my-6" />

                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#9a784e] font-semibold">
                      Member Account
                    </p>

                    <p className="text-xs text-[#81736a] mt-2 leading-5 max-w-[190px]">
                      Keep your details updated for a smoother shopping and
                      delivery experience.
                    </p>
                  </div>
                </div>

                {/* ==========================================
                    PROFILE FORM
                =========================================== */}
                <div className="px-6 py-8 md:px-10 md:py-11 lg:px-12">
                  {/* Personal Details */}
                  <div className="mb-9">
                    <div className="mb-6">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-[#a78352] font-semibold mb-1">
                        Your Information
                      </p>

                      <h2 className="font-[Cormorant_Garamond] text-3xl text-[#44352c]">
                        Personal Details
                      </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      {/* First Name */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="firstName"
                          className="text-xs text-[#665850]"
                        >
                          First Name
                        </Label>

                        <Input
                          id="firstName"
                          name="firstName"
                          type="text"
                          value={updateUser.firstName}
                          onChange={handleChange}
                          className="h-11 rounded-xl border-[#e2d7ca] bg-[#faf7f2] text-[#44352c] focus-visible:ring-[#b99a6b] focus-visible:border-[#b99a6b]"
                        />
                      </div>

                      {/* Last Name */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="lastName"
                          className="text-xs text-[#665850]"
                        >
                          Last Name
                        </Label>

                        <Input
                          id="lastName"
                          name="lastName"
                          type="text"
                          value={updateUser.lastName}
                          onChange={handleChange}
                          className="h-11 rounded-xl border-[#e2d7ca] bg-[#faf7f2] text-[#44352c] focus-visible:ring-[#b99a6b] focus-visible:border-[#b99a6b]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-[#eadfd3] mb-9" />

                  {/* Contact */}
                  <div className="mb-9">
                    <div className="mb-6">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-[#a78352] font-semibold mb-1">
                        Stay Connected
                      </p>

                      <h2 className="font-[Cormorant_Garamond] text-3xl text-[#44352c]">
                        Contact Details
                      </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      {/* Email */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="email"
                          className="flex items-center gap-2 text-xs text-[#665850]"
                        >
                          <Mail
                            className="w-3.5 h-3.5 text-[#a78352]"
                            strokeWidth={1.7}
                          />
                          Email
                        </Label>

                        <Input
                          id="email"
                          name="email"
                          type="email"
                          disabled
                          value={updateUser.email}
                          onChange={handleChange}
                          className="h-11 rounded-xl border-[#e2d7ca] bg-[#f1ece5] text-[#8b7d73] cursor-not-allowed"
                        />

                        <p className="text-[10px] text-[#9a8b81]">
                          Email address cannot be changed here.
                        </p>
                      </div>

                      {/* Phone */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="phoneNo"
                          className="flex items-center gap-2 text-xs text-[#665850]"
                        >
                          <Phone
                            className="w-3.5 h-3.5 text-[#a78352]"
                            strokeWidth={1.7}
                          />
                          Phone Number
                        </Label>

                        <Input
                          id="phoneNo"
                          name="phoneNo"
                          type="tel"
                          value={updateUser.phoneNo}
                          onChange={handleChange}
                          className="h-11 rounded-xl border-[#e2d7ca] bg-[#faf7f2] text-[#44352c] focus-visible:ring-[#b99a6b] focus-visible:border-[#b99a6b]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="h-px bg-[#eadfd3] mb-9" />

                  {/* Address */}
                  <div className="mb-9">
                    <div className="mb-6">
                      <p className="text-[10px] uppercase tracking-[0.28em] text-[#a78352] font-semibold mb-1 flex items-center gap-2">
                        <MapPin className="w-3.5 h-3.5" strokeWidth={1.7} />
                        Delivery
                      </p>

                      <h2 className="font-[Cormorant_Garamond] text-3xl text-[#44352c]">
                        Delivery Address
                      </h2>
                    </div>

                    <div className="space-y-5">
                      {/* Address */}
                      <div className="space-y-2">
                        <Label
                          htmlFor="address"
                          className="text-xs text-[#665850]"
                        >
                          Address
                        </Label>

                        <Input
                          id="address"
                          name="address"
                          type="text"
                          value={updateUser.address}
                          onChange={handleChange}
                          placeholder="Enter your delivery address"
                          className="h-11 rounded-xl border-[#e2d7ca] bg-[#faf7f2] text-[#44352c] placeholder:text-[#aaa098] focus-visible:ring-[#b99a6b] focus-visible:border-[#b99a6b]"
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-5">
                        {/* City */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="city"
                            className="text-xs text-[#665850]"
                          >
                            City
                          </Label>

                          <Input
                            id="city"
                            name="city"
                            type="text"
                            value={updateUser.city}
                            onChange={handleChange}
                            className="h-11 rounded-xl border-[#e2d7ca] bg-[#faf7f2] text-[#44352c] focus-visible:ring-[#b99a6b] focus-visible:border-[#b99a6b]"
                          />
                        </div>

                        {/* Zip */}
                        <div className="space-y-2">
                          <Label
                            htmlFor="zipCode"
                            className="text-xs text-[#665850]"
                          >
                            Zip Code
                          </Label>

                          <Input
                            id="zipCode"
                            name="zipCode"
                            type="text"
                            value={updateUser.zipCode}
                            onChange={handleChange}
                            className="h-11 rounded-xl border-[#e2d7ca] bg-[#faf7f2] text-[#44352c] focus-visible:ring-[#b99a6b] focus-visible:border-[#b99a6b]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Update Button */}
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-full bg-[#4a382c] hover:bg-[#35271f] text-white font-medium cursor-pointer transition-all shadow-md shadow-[#4a382c]/10"
                  >
                    {loading ? (
                      "Updating Profile..."
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" strokeWidth={1.7} />
                        Update Profile
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* ===================================================
            ORDERS TAB
        ==================================================== */}
        {activeTab === "orders" && (
          <div className="bg-[#fffdf9] border border-[#e5d9ca] rounded-[1.75rem] shadow-sm overflow-hidden">
            {/* Orders Header */}
            <div className="px-6 py-8 md:px-10 border-b border-[#eadfd3] bg-[#f5eee6]">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#e7d7c2] flex items-center justify-center">
                    <ShoppingBag
                      className="w-5 h-5 text-[#9a784e]"
                      strokeWidth={1.6}
                    />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] text-[#a78352] font-semibold mb-1">
                      Your Shopping History
                    </p>

                    <h2 className="font-[Cormorant_Garamond] text-3xl md:text-4xl text-[#44352c]">
                      Your Orders
                    </h2>

                    <p className="text-xs text-[#81736a] mt-1">
                      Track your previous purchases
                    </p>
                  </div>
                </div>

                <ChevronRight
                  className="hidden sm:block w-5 h-5 text-[#b99a6b]"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            {/* Orders */}
            <div className="p-6 md:p-10">
              <MyOrder />
            </div>
          </div>
        )}
      </div>

      {/* =====================================================
          BOTTOM BRAND MESSAGE
      ====================================================== */}
      <section className="px-6 pb-20 text-center">
        <div className="w-12 h-px bg-[#b99a6b] mx-auto mb-5" />

        <p className="font-[Cormorant_Garamond] italic text-2xl text-[#6b5441]">
          Style that feels like you.
        </p>

        <p className="text-[10px] uppercase tracking-[0.3em] text-[#a78352] mt-3">
          Sri Sai Balaji Dress Materials
        </p>
      </section>
    </div>
  );
};

export default Profile;
