import Razorpay from "razorpay";

const razorpayInstance = new Razorpay({
  key_id: process.env.PAZORPAY_KEY_ID,

  key_secret: process.env.RAZORPAY_SECRET,
});

export default razorpayInstance;
