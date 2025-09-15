import express from "express";
import { protect, admin } from "../middlewares/authMiddleware.js";
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  updateOrderStatus,
} from "../controllers/orderController.js";

const router = express.Router();

// Customer routes
router.post("/", protect, createOrder); // Create order
router.get("/myorders", protect, getMyOrders); // Get own orders

// Admin routes
router.get("/", protect, admin, getAllOrders); // Get all orders
router.patch("/:id", protect, admin, updateOrderStatus); // Update status

export default router;
