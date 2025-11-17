import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/config.js";
import userRoutes from "./routes/userRoutes.js";


dotenv.config(); // Load .env variables

// Connect to MongoDB
connectDB();

const app = express();
app.use("/api/users", userRoutes);
app.use(cors());
app.use(express.json()); // Parse JSON request body

// Test route
app.get("/", (req, res) => {
  res.send("Coffee Café API is running..");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});



