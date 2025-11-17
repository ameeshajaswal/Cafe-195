import express from "express";
import {
  createDrink,
  deleteDrink,
  getDrinks,
  getDrinkById,
  updateDrink
} from "../controllers/drinkController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create drink
router.post("/", protect, createDrink);

// Get all drinks
router.get("/", protect, getDrinks);

// Get drink by ID
router.get("/:id", protect, getDrinkById);

// Update a drink
router.put("/:id", protect, updateDrink);

// Delete a drink
router.delete("/:id", protect, deleteDrink);

export default router;
