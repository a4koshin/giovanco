import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import { checkoutCart } from "../controllers/checkoutController.js";

const router = express.Router();

// POST /api/checkout → checkout cart
router.post("/", protect, checkoutCart);

export default router;
