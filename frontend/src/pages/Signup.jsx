import React, { useState } from "react";
import { Eye, EyeOff, Loader2, ArrowRight, UserRound } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/user/register`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/verify");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message || "Signup failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #fbf8f2 0%, #f5eee5 50%, #eee2d5 100%)",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      {/* Decorative circles */}
      <div
        className="absolute -top-40 -right-40 w-[420px] h-[420px] rounded-full border pointer-events-none"
        style={{
          borderColor: "rgba(164,124,67,0.12)",
        }}
      />

      <div
        className="absolute -bottom-48 -left-48 w-[520px] h-[520px] rounded-full border pointer-events-none"
        style={{
          borderColor: "rgba(164,124,67,0.10)",
        }}
      />

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-lg rounded-[2rem] p-7 sm:p-10"
        style={{
          backgroundColor: "rgba(255,253,249,0.93)",
          border: "1px solid rgba(220,207,191,0.9)",
          boxShadow: "0 25px 70px rgba(61,44,35,0.10)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span
              className="w-10 h-px"
              style={{ backgroundColor: "#c8aa75" }}
            />

            <span style={{ color: "#a47c43" }}>✦</span>

            <span
              className="w-10 h-px"
              style={{ backgroundColor: "#c8aa75" }}
            />
          </div>

          <p
            className="text-[10px] uppercase tracking-[0.3em] mb-3"
            style={{ color: "#a47c43" }}
          >
            Sri Sai Balaji
          </p>

          <h1
            className="text-4xl sm:text-5xl"
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontWeight: 500,
              color: "#3d2c23",
            }}
          >
            Create Your Account
          </h1>

          <p className="mt-3 text-sm" style={{ color: "#806f61" }}>
            Join us and discover styles made for you.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={submitHandler} className="space-y-5">
          {/* Names */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-[10px] uppercase tracking-[0.18em] mb-2"
                style={{ color: "#6f5b4d" }}
              >
                First Name
              </label>

              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="John"
                required
                value={formData.firstName}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl outline-none"
                style={{
                  backgroundColor: "#fffdf9",
                  border: "1px solid #dfd1c0",
                  color: "#3d2c23",
                  fontSize: "13px",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="block text-[10px] uppercase tracking-[0.18em] mb-2"
                style={{ color: "#6f5b4d" }}
              >
                Last Name
              </label>

              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Doe"
                required
                value={formData.lastName}
                onChange={handleChange}
                className="w-full h-12 px-4 rounded-xl outline-none"
                style={{
                  backgroundColor: "#fffdf9",
                  border: "1px solid #dfd1c0",
                  color: "#3d2c23",
                  fontSize: "13px",
                }}
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-[10px] uppercase tracking-[0.18em] mb-2"
              style={{ color: "#6f5b4d" }}
            >
              Email Address
            </label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full h-12 px-4 rounded-xl outline-none"
              style={{
                backgroundColor: "#fffdf9",
                border: "1px solid #dfd1c0",
                color: "#3d2c23",
                fontSize: "13px",
              }}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-[10px] uppercase tracking-[0.18em] mb-2"
              style={{ color: "#6f5b4d" }}
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Create a password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full h-12 px-4 pr-12 rounded-xl outline-none"
                style={{
                  backgroundColor: "#fffdf9",
                  border: "1px solid #dfd1c0",
                  color: "#3d2c23",
                  fontSize: "13px",
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                style={{ color: "#927d6d" }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-60"
            style={{
              backgroundColor: "#3d2c23",
              color: "#fffdf9",
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Please Wait
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Login */}
        <div
          className="mt-7 pt-6 text-center border-t"
          style={{ borderColor: "#e7dccf" }}
        >
          <p className="text-sm" style={{ color: "#806f61" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#a47c43" }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
