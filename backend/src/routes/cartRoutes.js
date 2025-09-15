import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
  getCart,
  addToCart,
  removeFromCart,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

router.get("/", protect, getCart); // Get current user's cart
router.post("/", protect, addToCart); // Add/update product in cart
router.delete("/:productId", protect, removeFromCart); // Remove product
router.delete("/", protect, clearCart); // Clear entire cart

export default router;
