import React from "react";
import { Mail, CheckCircle2 } from "lucide-react";

const Verify = () => {
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
            backgroundColor: "#eadbc9",
            color: "#a47c43",
          }}
        >
          <Mail size={34} strokeWidth={1.5} />
        </div>

        <p
          className="text-[10px] uppercase tracking-[0.3em] mb-3"
          style={{ color: "#a47c43" }}
        >
          Almost There
        </p>

        <h1
          className="text-4xl"
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontWeight: 500,
            color: "#3d2c23",
          }}
        >
          Check Your Mail
        </h1>

        <p className="mt-4 text-sm leading-7" style={{ color: "#806f61" }}>
          We've sent you an email to verify your account. Please check your
          inbox and click the verification link to continue.
        </p>

        <div className="flex items-center gap-3 my-7">
          <div
            className="flex-1 h-px"
            style={{
              backgroundColor: "#e1d5c8",
            }}
          />

          <span
            className="text-[9px] uppercase tracking-[0.2em]"
            style={{ color: "#a08d7d" }}
          >
            Almost there
          </span>

          <div
            className="flex-1 h-px"
            style={{
              backgroundColor: "#e1d5c8",
            }}
          />
        </div>

        <div
          className="flex items-center justify-center gap-2 rounded-xl py-3 px-4"
          style={{
            backgroundColor: "#f4ede4",
            color: "#8a6b45",
          }}
        >
          <CheckCircle2 size={16} strokeWidth={1.6} />

          <span className="text-xs">Didn't get it? Check your spam folder</span>
        </div>

        <p
          className="mt-7 text-[10px] uppercase tracking-[0.2em]"
          style={{ color: "#a08d7d" }}
        >
          Sri Sai Balaji
        </p>
      </div>
    </div>
  );
};

export default Verify;
