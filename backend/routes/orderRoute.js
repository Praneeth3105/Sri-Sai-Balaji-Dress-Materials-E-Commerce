import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import {
  createOrder,
  getAllOrdersAdmin,
  getSalesData,
  getMyOrder,
  getUserOrders,
  verifyPayment,
} from "../controllers/orderController.js";
const router = express.Router();
router.post("/create-order", isAuthenticated, createOrder);
router.post("/verify-payment", isAuthenticated, verifyPayment);
router.get("/myorder", isAuthenticated, getMyOrder);
router.get("/all", isAuthenticated, isAdmin, getAllOrdersAdmin);
router.get("/user-order/:userId", isAuthenticated, isAdmin, getUserOrders);

router.get("/sales", isAuthenticated, isAdmin, getSalesData);

export default router;
