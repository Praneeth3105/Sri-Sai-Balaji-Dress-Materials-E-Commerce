import express from "express";
import { register, verify, reVerify, login, logout, forgotPassword, verifyOTP, changePassword, allUsers, getUserById, updateUser } from "../controllers/userController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { singleUpload } from "../middleware/multer.js";



const router = express.Router();
router.post("/register", register);
router.post("/verify", verify);
router.post("/reVerify", reVerify);
router.post("/login", login);
router.post("/logout", isAuthenticated, logout);
router.post("/forgot-password", forgotPassword);
router.post("/verify-otp/:email", verifyOTP);
router.post("/change-password/:email", changePassword);
router.get('/all-users', isAuthenticated, isAdmin, allUsers)
router.get("/get-user/:userId", getUserById);
router.put('/update/:id',isAuthenticated,singleUpload,updateUser)

export default router; 