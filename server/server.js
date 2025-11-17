import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/config.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import drinkRoutes from "./routes/drinkRoute.js";


dotenv.config(); // Load .env variables

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON request body
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/drinks", drinkRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Coffee Café API is running..");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
