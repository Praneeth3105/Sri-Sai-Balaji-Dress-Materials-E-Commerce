import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck } from "lucide-react";
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

  const verifyHandler = async (e) => {
    e.preventDefault();

    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const res = await axios.post(
        `http://localhost:8000/api/v1/user/verify-otp/${encodeURIComponent(
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

        // Store reset token temporarily
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

  const resendOTP = async () => {
    try {
      setResending(true);

      const res = await axios.post(
        "http://localhost:8000/api/v1/user/forgot-password",
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
    <div className="font-serif min-h-screen flex justify-center items-center bg-gray-50 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-3">
            <div className="p-3 rounded-full bg-gray-100">
              <ShieldCheck className="w-7 h-7" />
            </div>
          </div>

          <CardTitle className="font-serif">Verify OTP</CardTitle>

          <CardDescription>
            Enter the 6-digit OTP sent to
            <br />
            <span className="font-medium text-black">{decodedEmail}</span>
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={verifyHandler} className="space-y-5">
            <div className="grid gap-2">
              <Label htmlFor="otp">Enter OTP</Label>

              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                className="text-center text-xl tracking-[0.5em]"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-black hover:bg-gray-700"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Verifying...
                </>
              ) : (
                "Verify OTP"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={resendOTP}
            disabled={resending}
            className="w-full"
          >
            {resending ? "Sending..." : "Resend OTP"}
          </Button>

          <p className="text-sm text-gray-600">
            Wrong email?{" "}
            <Link
              to="/forgot-password"
              className="text-blue-600 hover:underline"
            >
              Change Email
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
};

export default VerifyOTP;
