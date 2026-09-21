import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";

const VerifyEmail = () => {
  const { token } = useParams();

  const [status, setStatus] = useState("Verifying.....");

  const navigate = useNavigate();

  const verifyEmail = async () => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/user/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (res.data.success) {
        setStatus("Email Verified Successfully");

        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.log(error);

      setStatus("Verification Failed. Please Try Again");
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [token]);

  const isSuccess = status.includes("Email Verified");

  const isError = status.includes("Verification Failed");

  const isLoading = !isSuccess && !isError;

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-24 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(135deg, #fbf8f2 0%, #f5eee5 50%, #eee2d5 100%)",
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      {/* Decorative */}
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
        className="relative z-10 w-full max-w-md rounded-[2rem] p-9 sm:p-10 text-center"
        style={{
          backgroundColor: "rgba(255,253,249,0.93)",
          border: "1px solid #dfd1c0",
          boxShadow: "0 25px 70px rgba(61,44,35,0.10)",
        }}
      >
        {/* Icon */}
        <div
          className="mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: isSuccess
              ? "#e6eee4"
              : isError
                ? "#f1e4df"
                : "#eadbc9",
            color: isSuccess ? "#66805e" : isError ? "#a05f4f" : "#a47c43",
          }}
        >
          {isLoading && (
            <Loader2 size={34} className="animate-spin" strokeWidth={1.5} />
          )}

          {isSuccess && <CheckCircle2 size={34} strokeWidth={1.5} />}

          {isError && <XCircle size={34} strokeWidth={1.5} />}
        </div>

        <p
          className="text-[10px] uppercase tracking-[0.3em] mb-3"
          style={{
            color: isSuccess ? "#66805e" : isError ? "#a05f4f" : "#a47c43",
          }}
        >
          {isLoading
            ? "Please Wait"
            : isSuccess
              ? "Success"
              : "Unable To Verify"}
        </p>

        <h1
          className="text-3xl sm:text-4xl"
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontWeight: 500,
            color: "#3d2c23",
          }}
        >
          {status}
        </h1>

        <p className="mt-4 text-sm leading-6" style={{ color: "#806f61" }}>
          {isLoading && "This will just take a moment..."}

          {isSuccess &&
            "Your account has been verified. Redirecting you to login..."}

          {isError &&
            "The verification link may have expired or already been used."}
        </p>

        <p
          className="mt-8 text-[10px] uppercase tracking-[0.2em]"
          style={{ color: "#a08d7d" }}
        >
          Sri Sai Balaji
        </p>
      </div>
    </div>
  );
};

export default VerifyEmail;
