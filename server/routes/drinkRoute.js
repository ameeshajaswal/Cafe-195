import express from "express";
import {
  createDrink,
  deleteDrink,
  getDrinks,
  getDrinkById,
  updateDrink
} from "../controllers/drinkController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Create drink
router.post("/", protect, admin, createDrink);

// Get all drinks
router.get("/", protect, getDrinks);

// Get drink by ID
router.get("/:id", protect, getDrinkById);

// Update a drink
router.put("/:id", protect, admin, updateDrink);

// Delete a drink
router.delete("/:id", protect, admin, deleteDrink);

export default router;
