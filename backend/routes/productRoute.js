import express from "express";
import {
  addProduct,
  deleteProduct,
  getAllProduct,
  getAvailableProducts,
  getOutOfStockProducts,
  updateProduct,
} from "../controllers/productController.js";
import { isAdmin, isAuthenticated } from "../middleware/isAuthenticated.js";
import { multipleUpload } from "../middleware/multer.js";

const router = express.Router();

router.post("/add", isAuthenticated, isAdmin, multipleUpload, addProduct);

// Admin product management: returns every product, including sold-out ones.
router.get("/getallproducts", isAuthenticated, isAdmin, getAllProduct);

// Customer catalogue: returns only products that still have stock.
router.get("/getavailableproducts", getAvailableProducts);

// Admin inventory management.
router.get("/out-of-stock", isAuthenticated, isAdmin, getOutOfStockProducts);

router.delete("/delete/:productId", isAuthenticated, isAdmin, deleteProduct);
router.put(
  "/update/:productId",
  isAuthenticated,
  isAdmin,
  multipleUpload,
  updateProduct,
);

export default router;
