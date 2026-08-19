import express from "express"
import {isAuthenticated} from "../middleware/isAuthenticated.js"
import { createOrder, getMyOrder, verifyPayment } from "../controllers/orderController.js"
const router = express.Router()
router.post("/create-order", isAuthenticated, createOrder)
router.post("/verify-payment", isAuthenticated, verifyPayment);
router.get("/myorder", isAuthenticated,getMyOrder);


export default router