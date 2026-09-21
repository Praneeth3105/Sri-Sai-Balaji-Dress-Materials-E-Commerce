import React, { useState } from "react";
import { Eye, EyeOff, Loader2, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/UserSlice";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();

  // ==================================================
  // HANDLE INPUT
  // ==================================================
  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // ==================================================
  // LOGIN
  // ==================================================
  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const res = await axios.post(
        `${import.meta.env.VITE_URL}/api/v1/user/login`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));

        localStorage.setItem("accessToken", res.data.accessToken);

        toast.success(res.data.message);

        navigate("/");
      }
    } catch (error) {
      console.log(error);

      toast.error(
        error?.response?.data?.message || "Login failed. Please try again.",
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
      {/* ==================================================
          DECORATIVE BACKGROUND
      ================================================== */}

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

      <div
        className="absolute top-1/4 left-10 w-20 h-20 rounded-full"
        style={{
          backgroundColor: "rgba(200,170,117,0.08)",
        }}
      />

      {/* ==================================================
          LOGIN CARD
      ================================================== */}

      <div
        className="relative z-10 w-full max-w-md rounded-[2rem] p-7 sm:p-10"
        style={{
          backgroundColor: "rgba(255,253,249,0.92)",
          border: "1px solid rgba(220,207,191,0.9)",
          boxShadow: "0 25px 70px rgba(61,44,35,0.10)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* ==================================================
            BRAND
        ================================================== */}

        <div className="text-center mb-9">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span
              className="w-10 h-px"
              style={{
                backgroundColor: "#c8aa75",
              }}
            />

            <span
              style={{
                color: "#a47c43",
                fontSize: "13px",
              }}
            >
              ✦
            </span>

            <span
              className="w-10 h-px"
              style={{
                backgroundColor: "#c8aa75",
              }}
            />
          </div>

          <p
            className="text-[10px] uppercase tracking-[0.3em] mb-3"
            style={{
              color: "#a47c43",
            }}
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
            Welcome Back
          </h1>

          <p
            className="mt-3 text-sm leading-6"
            style={{
              color: "#806f61",
            }}
          >
            Sign in to continue your shopping experience.
          </p>
        </div>

        {/* ==================================================
            FORM
        ================================================== */}

        <form onSubmit={submitHandler} className="space-y-5">
          {/* EMAIL */}
          <div>
            <label
              htmlFor="email"
              className="block text-[10px] uppercase tracking-[0.18em] mb-2"
              style={{
                color: "#6f5b4d",
              }}
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
              className="w-full h-12 px-4 rounded-xl outline-none transition-all duration-200"
              style={{
                backgroundColor: "#fffdf9",
                border: "1px solid #dfd1c0",
                color: "#3d2c23",
                fontFamily: "DM Sans, sans-serif",
                fontSize: "13px",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#b8945a";

                e.currentTarget.style.boxShadow =
                  "0 0 0 3px rgba(184,148,90,0.10)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#dfd1c0";

                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* PASSWORD */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="text-[10px] uppercase tracking-[0.18em]"
                style={{
                  color: "#6f5b4d",
                }}
              >
                Password
              </label>

              <Link
                to="/forgot-password"
                className="text-[11px] transition-colors"
                style={{
                  color: "#a47c43",
                }}
              >
                Forgot Password?
              </Link>
            </div>

            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full h-12 px-4 pr-12 rounded-xl outline-none transition-all duration-200"
                style={{
                  backgroundColor: "#fffdf9",
                  border: "1px solid #dfd1c0",
                  color: "#3d2c23",
                  fontFamily: "DM Sans, sans-serif",
                  fontSize: "13px",
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = "#b8945a";

                  e.currentTarget.style.boxShadow =
                    "0 0 0 3px rgba(184,148,90,0.10)";
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = "#dfd1c0";

                  e.currentTarget.style.boxShadow = "none";
                }}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                style={{
                  color: "#927d6d",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff size={18} strokeWidth={1.6} />
                ) : (
                  <Eye size={18} strokeWidth={1.6} />
                )}
              </button>
            </div>
          </div>

          {/* ==================================================
              LOGIN BUTTON
          ================================================== */}

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 rounded-full flex items-center justify-center gap-2 transition-all duration-300 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "#3d2c23",
              color: "#fffdf9",
              fontFamily: "DM Sans, sans-serif",
              fontSize: "11px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.backgroundColor = "#a47c43";

                e.currentTarget.style.boxShadow =
                  "0 10px 25px rgba(164,124,67,0.20)";
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#3d2c23";

              e.currentTarget.style.boxShadow = "none";
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Please Wait
              </>
            ) : (
              <>
                Login
                <ArrowRight size={16} strokeWidth={1.7} />
              </>
            )}
          </button>
        </form>

        {/* ==================================================
            SIGNUP
        ================================================== */}

        <div
          className="mt-7 pt-6 text-center border-t"
          style={{
            borderColor: "#e7dccf",
          }}
        >
          <p
            className="text-sm"
            style={{
              color: "#806f61",
            }}
          >
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium transition-colors"
              style={{
                color: "#a47c43",
              }}
            >
              Create one
            </Link>
          </p>
        </div>

        {/* ==================================================
            BOTTOM BRAND LINE
        ================================================== */}

        <div className="flex items-center justify-center gap-3 mt-7">
          <span
            className="w-6 h-px"
            style={{
              backgroundColor: "#d7c3aa",
            }}
          />

          <span
            className="text-[9px] uppercase tracking-[0.2em]"
            style={{
              color: "#a08d7d",
            }}
          >
            Style that feels like you
          </span>

          <span
            className="w-6 h-px"
            style={{
              backgroundColor: "#d7c3aa",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
