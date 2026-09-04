import express from "express";
import {
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  getMyOrders,
  deleteMyOrder,
  updateMyOrder,
  updateOrder
} from "../controllers/orderController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create an order
router.post("/", protect, createOrder);

// Current user orders
router.get("/mine", protect, getMyOrders);
router.put("/mine/:id", protect, updateMyOrder);
router.delete("/mine/:id", protect, deleteMyOrder);

// Administrative order management
router.get("/", protect, admin, getOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id", protect, admin, updateOrder);
router.delete("/:id", protect, admin, deleteOrder);

export default router;
