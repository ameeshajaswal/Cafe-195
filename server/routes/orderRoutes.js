import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  updateOrder
} from "../controllers/orderController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create an order
router.post("/", protect, createOrder);

// Read orders
router.get("/", protect, getOrders);
router.get("/:id", protect, getOrderById);

// Update an order
router.put("/:id", protect, updateOrder);

// Delete an order
router.delete("/:id", protect, deleteOrder);

export default router;
