import express from "express";
import { registerUser, loginUser, getUsers } from "../controllers/userController.js";

const router = express.Router();

// CRUD and auth routes
router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/", getUsers); // List all users

export default router;
