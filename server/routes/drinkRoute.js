import express from "express";
import {
  getDrinks,
  getDrinkById
} from "../controllers/drinkController.js";

const router = express.Router();

// Get all drinks
router.get("/", getDrinks);

// Get drink by ID
router.get("/:id", getDrinkById);

export default router;
