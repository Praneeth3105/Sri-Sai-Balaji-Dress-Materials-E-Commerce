import express from "express";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import {
  createCoupon,
  getAllCoupons,
  updateCoupon,
  approveCoupon,
  rejectCoupon,
  toggleCoupon,
  deleteCoupon,
  getAvailableCoupons,
} from "../controllers/couponController.js";

const router = express.Router();

router.get("/available", isAuthenticated, getAvailableCoupons);
router.get("/all", isAuthenticated, isAdmin, getAllCoupons);
router.post("/create", isAuthenticated, isAdmin, createCoupon);
router.put("/:couponId", isAuthenticated, isAdmin, updateCoupon);
router.put("/:couponId/approve", isAuthenticated, isAdmin, approveCoupon);
router.put("/:couponId/reject", isAuthenticated, isAdmin, rejectCoupon);
router.put("/:couponId/toggle", isAuthenticated, isAdmin, toggleCoupon);
router.delete("/:couponId", isAuthenticated, isAdmin, deleteCoupon);

export default router;
