import express from "express";
import {
  createProduct,
  getProducts,
  getProduct,
} from "../controllers/productController.js";
import { protect, admin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, admin, createProduct); // Admin only
router.get("/", getProducts); // Public
router.get("/:id", getProduct); // Public

export default router;
