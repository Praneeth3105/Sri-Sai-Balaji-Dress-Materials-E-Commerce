import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import {
  applyCoupon,
  createOrder,
  getAllOrdersAdmin,
  getOrderById,
  getSalesData,
  getMyOrder,
  getUserOrders,
  updateOrderStatus,
  verifyPayment,
} from "../controllers/orderController.js";

const router = express.Router();

router.post("/apply-coupon", isAuthenticated, applyCoupon);
router.post("/create-order", isAuthenticated, createOrder);
router.post("/verify-payment", isAuthenticated, verifyPayment);
router.get("/myorder", isAuthenticated, getMyOrder);
router.get("/myorder/:orderId", isAuthenticated, getOrderById);
router.get("/all", isAuthenticated, isAdmin, getAllOrdersAdmin);
router.get("/user-order/:userId", isAuthenticated, isAdmin, getUserOrders);
router.put("/:orderId/status", isAuthenticated, isAdmin, updateOrderStatus);
router.get("/sales", isAuthenticated, isAdmin, getSalesData);

export default router;
