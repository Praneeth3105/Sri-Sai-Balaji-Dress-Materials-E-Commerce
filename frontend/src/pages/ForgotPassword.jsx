import React, { useState } from "react";
import { Loader2, Mail, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/user/forgot-password`,
        { email },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);

        navigate(`/verify-otp/${encodeURIComponent(email)}`);
      }
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "Something went wrong");
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
        className="absolute -top-40 -right-40 w-[420px] h-[420px] rounded-full border"
        style={{
          borderColor: "rgba(164,124,67,0.12)",
        }}
      />

      <div
        className="absolute -bottom-48 -left-48 w-[520px] h-[520px] rounded-full border"
        style={{
          borderColor: "rgba(164,124,67,0.10)",
        }}
      />

      <div
        className="relative z-10 w-full max-w-md rounded-[2rem] p-8 sm:p-10 text-center"
        style={{
          backgroundColor: "rgba(255,253,249,0.93)",
          border: "1px solid #dfd1c0",
          boxShadow: "0 25px 70px rgba(61,44,35,0.10)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Icon */}
        <div
          className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: "#eadbc9",
            color: "#a47c43",
          }}
        >
          <Mail size={28} strokeWidth={1.5} />
        </div>

        <p
          className="text-[10px] uppercase tracking-[0.3em] mb-3"
          style={{ color: "#a47c43" }}
        >
          Account Recovery
        </p>

        <h1
          className="text-4xl"
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontWeight: 500,
            color: "#3d2c23",
          }}
        >
          Forgot Password
        </h1>

        <p className="mt-3 text-sm leading-6" style={{ color: "#806f61" }}>
          Enter your registered email address and we'll send you a verification
          code.
        </p>

        <form onSubmit={submitHandler} className="mt-8 text-left space-y-5">
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
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 px-4 rounded-xl outline-none"
              style={{
                backgroundColor: "#fffdf9",
                border: "1px solid #dfd1c0",
                color: "#3d2c23",
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full flex items-center justify-center gap-2 transition-all disabled:opacity-60"
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
                Sending OTP...
              </>
            ) : (
              <>
                Send OTP
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="mt-7">
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

export default ForgotPassword;
