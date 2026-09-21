import React, { useState } from "react";
import { Eye, EyeOff, Loader2, LockKeyhole, ArrowRight } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const ResetPassword = () => {
  const { email } = useParams();
  const decodedEmail = decodeURIComponent(email);

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
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

    const resetToken = sessionStorage.getItem("passwordResetToken");

    const resetEmail = sessionStorage.getItem("passwordResetEmail");

    if (!resetToken || resetEmail !== decodedEmail) {
      toast.error("Password reset session expired. Please request a new OTP.");

      navigate("/forgot-password");
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/user/change-password/${encodeURIComponent(
          decodedEmail,
        )}`,
        {
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${resetToken}`,
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);

        sessionStorage.removeItem("passwordResetToken");

        sessionStorage.removeItem("passwordResetEmail");

        navigate("/login");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message || "Unable to change password",
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
      <div
        className="relative z-10 w-full max-w-md rounded-[2rem] p-8 sm:p-10"
        style={{
          backgroundColor: "rgba(255,253,249,0.93)",
          border: "1px solid #dfd1c0",
          boxShadow: "0 25px 70px rgba(61,44,35,0.10)",
        }}
      >
        <div className="text-center mb-8">
          <div
            className="mx-auto mb-5 w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "#eadbc9",
              color: "#a47c43",
            }}
          >
            <LockKeyhole size={27} strokeWidth={1.5} />
          </div>

          <p
            className="text-[10px] uppercase tracking-[0.3em] mb-3"
            style={{ color: "#a47c43" }}
          >
            Secure Account
          </p>

          <h1
            className="text-4xl"
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontWeight: 500,
              color: "#3d2c23",
            }}
          >
            Reset Password
          </h1>

          <p className="mt-3 text-sm leading-6" style={{ color: "#806f61" }}>
            Create a new password for
          </p>

          <p
            className="mt-1 text-sm font-medium break-all"
            style={{ color: "#3d2c23" }}
          >
            {decodedEmail}
          </p>
        </div>

        <form onSubmit={submitHandler} className="space-y-5">
          {/* New password */}
          <div>
            <label
              htmlFor="newPassword"
              className="block text-[10px] uppercase tracking-[0.18em] mb-2"
              style={{ color: "#6f5b4d" }}
            >
              New Password
            </label>

            <div className="relative">
              <input
                id="newPassword"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                placeholder="Enter new password"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full h-12 px-4 pr-12 rounded-xl outline-none"
                required
                style={{
                  backgroundColor: "#fffdf9",
                  border: "1px solid #dfd1c0",
                  color: "#3d2c23",
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: "#927d6d" }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Confirm */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-[10px] uppercase tracking-[0.18em] mb-2"
              style={{ color: "#6f5b4d" }}
            >
              Confirm Password
            </label>

            <div className="relative">
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm new password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full h-12 px-4 pr-12 rounded-xl outline-none"
                required
                style={{
                  backgroundColor: "#fffdf9",
                  border: "1px solid #dfd1c0",
                  color: "#3d2c23",
                }}
              />

              <button
                type="button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
                style={{ color: "#927d6d" }}
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <p className="text-xs" style={{ color: "#927d6d" }}>
            Password must contain at least 6 characters.
          </p>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full flex items-center justify-center gap-2 disabled:opacity-60"
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
                Updating Password...
              </>
            ) : (
              <>
                Reset Password
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-7 text-center">
          <p className="text-sm" style={{ color: "#806f61" }}>
            Remember your password?{" "}
            <Link to="/login" style={{ color: "#a47c43" }}>
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
