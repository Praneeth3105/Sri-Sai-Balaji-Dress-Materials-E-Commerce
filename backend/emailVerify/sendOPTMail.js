import nodemailer from "nodemailer";
import "dotenv/config";

export const sendOTPMail = async (otp, email) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });
  const mailConfigurations = {
    from: process.env.MAIL_USER,

    to: email,

    subject: "Password Reset OTP",
    html: `<p>Your OTP for Password Reset is: <b>${otp}</b></p>`,
  };
  transporter.sendMail(mailConfigurations, function (error, info) {
    if (error) throw Error(error);
    console.log("OTP  Sent Successfully");
    console.log(info);
  });
};
