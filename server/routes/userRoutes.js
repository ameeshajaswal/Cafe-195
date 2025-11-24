import express from "express";
import {
  bootstrapAdmin,
  deleteUser,
  deleteMe,
  getUserById,
  getUsers,
  getMe,
  loginUser,
  registerUser,
  updateMe,
  updateUser
} from "../controllers/userController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);

// Current user profile
router.get("/me", protect, getMe);
router.put("/me", protect, updateMe);
router.delete("/me", protect, deleteMe);

// One-time admin bootstrap (no auth; remove in production)
router.post("/bootstrap-admin", bootstrapAdmin);

// User CRUD (admin only)
router.get("/", protect, admin, getUsers);
router.get("/:id", protect, admin, getUserById);
router.put("/:id", protect, admin, updateUser);
router.delete("/:id", protect, admin, deleteUser);

export default router;
