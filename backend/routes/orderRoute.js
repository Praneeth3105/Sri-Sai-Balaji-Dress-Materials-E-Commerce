import express from "express"
import {isAuthenticated} from "../middleware/isAuthenticated.js"
import { createOrder, verifyPayment } from "../controllers/orderController.js"
const router = express.Router()
router.post("/create-order", isAuthenticated, createOrder)
router.post("/verify-payment", isAuthenticated, verifyPayment);


export default router