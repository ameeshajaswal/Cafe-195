import express from "express";
import {
  createFood,
  deleteFood,
  getFoods,
  getFoodById,
  updateFood
} from "../controllers/foodController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create food
router.post("/", protect, createFood);

// Get all food items
router.get("/", protect, getFoods);

// Get food by ID
router.get("/:id", protect, getFoodById);

// Update a food item
router.put("/:id", protect, updateFood);

// Delete a food item
router.delete("/:id", protect, deleteFood);

export default router;
