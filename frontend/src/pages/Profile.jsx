import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Camera, User, ShoppingBag, Mail, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Profile = () => {
  const { user } = useSelector((store) => store.user);

  const [activeTab, setActiveTab] = useState("profile");
  const [profileImage, setProfileImage] = useState(user?.profilePicture || "");

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    zipCode: user?.zipCode || "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const updateProfileHandler = (e) => {
    e.preventDefault();
    console.log("Profile Data:", formData);
    console.log("Profile Image:", profileImage);
    // Backend update logic will be added here
  };

  const fullName =
    [formData.firstName, formData.lastName].filter(Boolean).join(" ") ||
    "Your name";

  return (
    <div className="pt-20 min-h-screen bg-[#FBF6EF]">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Eyebrow + Heading */}
        <div className="text-center mb-8">
          <p className="text-xs tracking-[0.25em] uppercase text-[#B08D57] font-medium mb-2">
            Sri Sai Balaji Dress Materials
          </p>
          <h1 className="text-3xl md:text-4xl font-bold font-serif text-[#3A2E28]">
            Your account
          </h1>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-10">
          <div className="bg-white border border-[#EADFCD] rounded-full p-1 shadow-sm flex">
            <button
              type="button"
              onClick={() => setActiveTab("profile")}
              className={`flex items-center gap-2 px-6 py-2 rounded-full font-serif text-sm cursor-pointer transition ${
                activeTab === "profile"
                  ? "bg-[#7A2E3A] text-[#FBF6EF]"
                  : "text-[#6B5D50] hover:bg-[#FBF6EF]"
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
                  ? "bg-[#7A2E3A] text-[#FBF6EF]"
                  : "text-[#6B5D50] hover:bg-[#FBF6EF]"
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Orders
            </button>
          </div>
        </div>

        {/* ================= PROFILE ================= */}
        {activeTab === "profile" && (
          <form
            onSubmit={updateProfileHandler}
            className="bg-white rounded-2xl shadow-sm border border-[#EADFCD] overflow-hidden"
          >
            <div className="grid md:grid-cols-[240px_1fr]">
              {/* Left: identity panel */}
              <div className="bg-[#FBF6EF] border-b md:border-b-0 md:border-r border-[#EADFCD] px-6 py-10 flex flex-col items-center text-center">
                <div className="relative">
                  <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-[#C9A24B] bg-[#F3E4DE] flex items-center justify-center">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-[#B08D57]" />
                    )}
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
                    className="absolute -bottom-1 -right-1 bg-[#7A2E3A] hover:bg-[#5E2129] text-white w-9 h-9 rounded-full cursor-pointer flex items-center justify-center transition shadow-sm"
                    aria-label="Change picture"
                  >
                    <Camera className="w-4 h-4" />
                  </label>
                </div>

                <p className="mt-5 font-serif text-lg text-[#3A2E28]">
                  {fullName}
                </p>
                {formData.email && (
                  <p className="text-xs text-[#8A7A6B] mt-1">
                    {formData.email}
                  </p>
                )}

                <div className="w-10 h-px bg-[#C9A24B] my-6" />

                <p className="text-xs text-[#8A7A6B] leading-relaxed">
                  Keep your details current so orders and deliveries reach you
                  without a hitch.
                </p>
              </div>

              {/* Right: form fields */}
              <div className="px-6 py-8 md:px-10 md:py-10">
                {/* Section: Personal details */}
                <div className="mb-8">
                  <h2 className="text-xs tracking-[0.2em] uppercase text-[#B08D57] font-medium mb-5">
                    Personal details
                  </h2>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="grid gap-2">
                      <Label htmlFor="firstName" className="text-[#3A2E28]">
                        First name
                      </Label>
                      <Input
                        id="firstName"
                        name="firstName"
                        type="text"
                        placeholder="John"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="border-[#EADFCD] focus-visible:ring-[#C9A24B]"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="lastName" className="text-[#3A2E28]">
                        Last name
                      </Label>
                      <Input
                        id="lastName"
                        name="lastName"
                        type="text"
                        placeholder="Doe"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="border-[#EADFCD] focus-visible:ring-[#C9A24B]"
                      />
                    </div>
                  </div>
                </div>

                {/* Stitch divider */}
                <div
                  className="border-t border-dashed border-[#D8C7A8] mb-8"
                  aria-hidden="true"
                />

                {/* Section: Contact */}
                <div className="mb-8">
                  <h2 className="text-xs tracking-[0.2em] uppercase text-[#B08D57] font-medium mb-5">
                    Contact
                  </h2>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="grid gap-2">
                      <Label
                        htmlFor="email"
                        className="text-[#3A2E28] flex items-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5 text-[#B08D57]" />
                        Email
                      </Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="example@gmail.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="border-[#EADFCD] focus-visible:ring-[#C9A24B]"
                      />
                    </div>

                    <div className="grid gap-2">
                      <Label
                        htmlFor="phone"
                        className="text-[#3A2E28] flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5 text-[#B08D57]" />
                        Phone number
                      </Label>
                      <Input
                        id="phone"
                        name="phone"
                        type="tel"
                        placeholder="Your contact number"
                        value={formData.phone}
                        onChange={handleChange}
                        className="border-[#EADFCD] focus-visible:ring-[#C9A24B]"
                      />
                    </div>
                  </div>
                </div>

                {/* Stitch divider */}
                <div
                  className="border-t border-dashed border-[#D8C7A8] mb-8"
                  aria-hidden="true"
                />

                {/* Section: Address */}
                <div className="mb-9">
                  <h2 className="text-xs tracking-[0.2em] uppercase text-[#B08D57] font-medium mb-5 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#B08D57]" />
                    Delivery address
                  </h2>

                  <div className="grid gap-5">
                    <div className="grid gap-2">
                      <Label htmlFor="address" className="text-[#3A2E28]">
                        Address
                      </Label>
                      <Input
                        id="address"
                        name="address"
                        type="text"
                        placeholder="House no, street, area"
                        value={formData.address}
                        onChange={handleChange}
                        className="border-[#EADFCD] focus-visible:ring-[#C9A24B]"
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-5">
                      <div className="grid gap-2">
                        <Label htmlFor="city" className="text-[#3A2E28]">
                          City
                        </Label>
                        <Input
                          id="city"
                          name="city"
                          type="text"
                          placeholder="Vijayawada"
                          value={formData.city}
                          onChange={handleChange}
                          className="border-[#EADFCD] focus-visible:ring-[#C9A24B]"
                        />
                      </div>

                      <div className="grid gap-2">
                        <Label htmlFor="zipCode" className="text-[#3A2E28]">
                          Zip code
                        </Label>
                        <Input
                          id="zipCode"
                          name="zipCode"
                          type="text"
                          placeholder="520001"
                          value={formData.zipCode}
                          onChange={handleChange}
                          className="border-[#EADFCD] focus-visible:ring-[#C9A24B]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-[#7A2E3A] hover:bg-[#5E2129] text-white font-serif cursor-pointer py-3 rounded-lg"
                >
                  Save changes
                </Button>
              </div>
            </div>
          </form>
        )}

        {/* ================= ORDERS ================= */}
        {activeTab === "orders" && (
          <div className="bg-white rounded-2xl shadow-sm border border-[#EADFCD] p-6 md:p-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-[#FBF6EF] border border-[#EADFCD] flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-[#7A2E3A]" />
              </div>
              <div>
                <h2 className="text-2xl font-bold font-serif text-[#3A2E28]">
                  Your orders
                </h2>
                <p className="text-sm text-[#8A7A6B]">
                  Track and review past purchases
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-20 h-20 rounded-full bg-[#FBF6EF] border border-[#EADFCD] flex items-center justify-center">
                <ShoppingBag className="w-9 h-9 text-[#C9A24B]" />
              </div>
              <h3 className="text-xl font-semibold font-serif text-[#3A2E28] mt-5">
                No orders yet
              </h3>
              <p className="text-[#8A7A6B] mt-2 max-w-sm">
                Once you place an order, it'll show up here with its status and
                delivery details.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
