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
        `http://localhost:8000/api/v1/user/verify`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (res.data.success) {
        setStatus("✅ Email Verified Successfully");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setStatus("❌ Verification Failed. Please Try Again");
    }
  };

  useEffect(() => {
    verifyEmail();
  }, [token]);

  // Derive icon/state purely for styling — doesn't touch your logic
  const isSuccess = status.includes("✅");
  const isError = status.includes("❌");
  const isLoading = !isSuccess && !isError;

  return (
    <div className="relative w-full h-[760px] bg-gradient-to-br from-orange-50 via-orange-100 to-amber-100 overflow-hidden">
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="bg-white/90 backdrop-blur-sm p-10 rounded-3xl shadow-2xl shadow-orange-200/50 border border-orange-100 text-center w-[90%] max-w-md transition-all duration-300">
          {/* Icon */}
          <div
            className={`mx-auto mb-6 w-20 h-20 rounded-full flex items-center justify-center ring-8 ${
              isSuccess
                ? "bg-green-100 ring-green-50"
                : isError
                  ? "bg-red-100 ring-red-50"
                  : "bg-orange-100 ring-orange-50"
            }`}
          >
            {isLoading && (
              <Loader2
                className="w-9 h-9 text-orange-500 animate-spin"
                strokeWidth={1.8}
              />
            )}
            {isSuccess && (
              <CheckCircle2
                className="w-9 h-9 text-green-500"
                strokeWidth={1.8}
              />
            )}
            {isError && (
              <XCircle className="w-9 h-9 text-red-500" strokeWidth={1.8} />
            )}
          </div>

          {/* Status text */}
          <h2
            className={`text-xl md:text-2xl font-serif font-semibold tracking-tight ${
              isSuccess
                ? "text-green-600"
                : isError
                  ? "text-red-500"
                  : "text-gray-800"
            }`}
          >
            {status.replace(/✅|❌/g, "").trim()}
          </h2>

          {/* Helper subtext */}
          <p className="text-gray-400 text-sm font-serif mt-3">
            {isLoading && "This will just take a moment..."}
            {isSuccess && "Redirecting you to login..."}
            {isError && "The link may have expired or already been used."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
