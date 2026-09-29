import "dotenv/config";
import { sendGmail } from "./gmailSender.js";

export const sendOTPMail = async (otp, email) => {
  try {
    const html = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8" /><title>Password Reset OTP</title></head>
<body style="margin:0;padding:0;background:#f8f4ee;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:600px;margin:40px auto;background:#fffdf9;border:1px solid #e5d9ca;border-radius:16px;overflow:hidden;">
    <div style="background:#4a382c;padding:30px;text-align:center;">
      <h1 style="margin:0;color:#f7ead8;font-family:Georgia,serif;font-weight:normal;">Sri Sai Balaji</h1>
      <p style="color:#dfcfba;letter-spacing:2px;font-size:12px;">DRESS MATERIALS</p>
    </div>
    <div style="padding:40px 30px;text-align:center;">
      <h2 style="color:#35271f;font-family:Georgia,serif;font-weight:normal;">Password Reset OTP</h2>
      <p style="color:#7b6d64;line-height:1.7;">Use the OTP below to reset your password.</p>
      <div style="margin:30px auto;padding:18px;max-width:250px;background:#f4efe7;border:1px solid #e5d9ca;border-radius:10px;font-size:28px;font-weight:bold;letter-spacing:8px;color:#4a382c;">${otp}</div>
      <p style="color:#8a7c72;font-size:13px;">This OTP is valid for 10 minutes.</p>
      <p style="color:#8a7c72;font-size:12px;margin-top:30px;">If you did not request a password reset, you can safely ignore this email.</p>
    </div>
    <div style="padding:20px;background:#f4efe7;text-align:center;">
      <p style="margin:0;color:#4a382c;font-family:Georgia,serif;">Sri Sai Balaji Dress Materials</p>
    </div>
  </div>
</body>
</html>`;

    const result = await sendGmail({
      to: email,
      subject: "Password Reset OTP - Sri Sai Balaji Dress Materials",
      html,
    });

    console.log("Password reset OTP sent successfully to:", email);
    return { success: true, emailId: result.emailId };
  } catch (error) {
    console.error(
      "Password reset OTP email failed:",
      error.response?.data || error.message,
    );
    throw error;
  }
};
