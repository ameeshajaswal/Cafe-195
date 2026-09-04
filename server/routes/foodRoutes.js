import express from "express";
import {
  createFood,
  deleteFood,
  getFoods,
  getFoodById,
  updateFood
} from "../controllers/foodController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create food
router.post("/", protect, admin, createFood);

// Get all food items
router.get("/", protect, getFoods);

// Get food by ID
router.get("/:id", protect, getFoodById);

// Update a food item
router.put("/:id", protect, admin, updateFood);

// Delete a food item
router.delete("/:id", protect, admin, deleteFood);

export default router;
