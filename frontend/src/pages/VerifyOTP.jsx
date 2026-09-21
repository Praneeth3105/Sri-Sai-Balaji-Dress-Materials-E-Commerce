import React, { useState } from "react";
import { Loader2, ShieldCheck, ArrowRight } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";

const VerifyOTP = () => {
  const { email } = useParams();

  const decodedEmail = decodeURIComponent(email);

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  const navigate = useNavigate();

  // ==================================================
  // VERIFY OTP
  // ==================================================
  const verifyHandler = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/user/verify-otp/${encodeURIComponent(
          decodedEmail,
        )}`,
        {
          otp,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (res.data.success) {
        toast.success(res.data.message);

        sessionStorage.setItem("passwordResetToken", res.data.resetToken);

        sessionStorage.setItem("passwordResetEmail", decodedEmail);

        navigate(`/reset-password/${encodeURIComponent(decodedEmail)}`);
      }
    } catch (error) {
      console.log(error);

      toast.error(error?.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  // ==================================================
  // RESEND OTP
  // ==================================================
  const resendOTP = async () => {
    try {
      setResending(true);

      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/user/forgot-password`,
        {
          email: decodedEmail,
        },
      );

      if (res.data.success) {
        toast.success("New OTP Sent to Your Email");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Unable to resend OTP");
    } finally {
      setResending(false);
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

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-md rounded-[2rem] p-8 sm:p-10"
        style={{
          backgroundColor: "rgba(255,253,249,0.93)",
          border: "1px solid #dfd1c0",
          boxShadow: "0 25px 70px rgba(61,44,35,0.10)",
        }}
      >
        <div className="text-center">
          {/* Icon */}
          <div
            className="mx-auto mb-6 w-16 h-16 rounded-full flex items-center justify-center"
            style={{
              backgroundColor: "#eadbc9",
              color: "#a47c43",
            }}
          >
            <ShieldCheck size={29} strokeWidth={1.5} />
          </div>

          <p
            className="text-[10px] uppercase tracking-[0.3em] mb-3"
            style={{ color: "#a47c43" }}
          >
            Secure Verification
          </p>

          <h1
            className="text-4xl"
            style={{
              fontFamily: "Cormorant Garamond, serif",
              fontWeight: 500,
              color: "#3d2c23",
            }}
          >
            Verify OTP
          </h1>

          <p className="mt-3 text-sm leading-6" style={{ color: "#806f61" }}>
            Enter the 6-digit OTP sent to
          </p>

          <p
            className="mt-1 text-sm font-medium break-all"
            style={{ color: "#3d2c23" }}
          >
            {decodedEmail}
          </p>
        </div>

        <form onSubmit={verifyHandler} className="mt-8 space-y-5">
          <div>
            <label
              htmlFor="otp"
              className="block text-[10px] uppercase tracking-[0.18em] mb-2"
              style={{ color: "#6f5b4d" }}
            >
              Verification Code
            </label>

            <input
              id="otp"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              required
              className="w-full h-14 rounded-xl outline-none text-center text-2xl tracking-[0.5em]"
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
                Verifying...
              </>
            ) : (
              <>
                Verify OTP
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Resend */}
        <button
          type="button"
          onClick={resendOTP}
          disabled={resending}
          className="w-full mt-4 h-11 rounded-full transition-all"
          style={{
            backgroundColor: "transparent",
            border: "1px solid #cdbda9",
            color: "#6f5b4d",
            fontSize: "11px",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
          }}
        >
          {resending ? "Sending..." : "Resend OTP"}
        </button>

        <div className="text-center mt-6">
          <p className="text-sm" style={{ color: "#806f61" }}>
            Wrong email?{" "}
            <Link to="/forgot-password" style={{ color: "#a47c43" }}>
              Change Email
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
