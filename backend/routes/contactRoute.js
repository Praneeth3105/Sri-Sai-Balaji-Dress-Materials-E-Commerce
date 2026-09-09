import express from "express";

import {
  submitContact,
  getContactMessages,
} from "../controllers/contactController.js";

import { isAuthenticated, isAdmin } from "../middleware/isAuthenticated.js";

const router = express.Router();

// PUBLIC
// Anyone can submit a contact message
router.post("/", submitContact);

router.get("/", isAuthenticated, isAdmin, getContactMessages);

export default router;
