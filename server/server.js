import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/config.js";
import userRoutes from "./routes/userRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import foodRoutes from "./routes/foodRoutes.js";
import drinkRoutes from "./routes/drinkRoute.js";

// In-memory carts (migrate to DB-backed models when ready)
let drinkCart = {
  icedLatte: 0,
  icedChocolate: 0,
  icedCappuccino: 0,
  strawberrySmoothie: 0
};

let foodCart = {
  croissant: 0,
  clubSandwich: 0,
  spaghetti: 0,
  kuyteav: 0
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootEnvPath = path.join(__dirname, "..", ".env");

dotenv.config(); // Load server/.env if present
if (!process.env.MONGO_URI) {
  dotenv.config({ path: rootEnvPath }); // Fallback to repo root .env
}

// Connect to MongoDB
connectDB();

const app = express();
app.use(cors());
app.use(express.json()); // Parse JSON request body
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/drinks", drinkRoutes);

// ---------------------- CART ROUTES ----------------------
app.post("/api/drinkCart/reset", (req, res) => {
  drinkCart = {
    icedLatte: 0,
    icedChocolate: 0,
    icedCappuccino: 0,
    strawberrySmoothie: 0
  };
  res.json({ message: "Drink cart cleared" });
});

app.post("/api/foodCart/reset", (req, res) => {
  foodCart = {
    croissant: 0,
    clubSandwich: 0,
    spaghetti: 0,
    kuyteav: 0
  };
  res.json({ message: "Food cart cleared" });
});

// GET carts
app.get("/api/drinkCart", (req, res) => {
  res.json(drinkCart);
});

app.get("/api/foodCart", (req, res) => {
  res.json(foodCart);
});

// Set quantity
app.post("/api/drinkCart/:item", (req, res) => {
  const { item } = req.params;
  const { quantity } = req.body;

  if (!Object.prototype.hasOwnProperty.call(drinkCart, item)) {
    return res.status(400).json({ error: "Drink item not found" });
  }

  drinkCart[item] = quantity;
  res.json(drinkCart);
});

app.post("/api/foodCart/:item", (req, res) => {
  const { item } = req.params;
  const { quantity } = req.body;

  if (!Object.prototype.hasOwnProperty.call(foodCart, item)) {
    return res.status(400).json({ error: "Food item not found" });
  }

  foodCart[item] = quantity;
  res.json(foodCart);
});

// Add / remove
app.post("/api/drinkCart/:item/:action", (req, res) => {
  const { item, action } = req.params;

  if (!Object.prototype.hasOwnProperty.call(drinkCart, item)) {
    return res.status(400).json({ error: "Drink item not found" });
  }

  if (action === "add") drinkCart[item] += 1;
  if (action === "remove" && drinkCart[item] > 0) drinkCart[item] -= 1;

  res.json(drinkCart);
});

app.post("/api/foodCart/:item/:action", (req, res) => {
  const { item, action } = req.params;

  if (!Object.prototype.hasOwnProperty.call(foodCart, item)) {
    return res.status(400).json({ error: "Food item not found" });
  }

  if (action === "add") foodCart[item] += 1;
  if (action === "remove" && foodCart[item] > 0) foodCart[item] -= 1;

  res.json(foodCart);
});

// Test route
app.get("/", (req, res) => {
  res.send("Coffee Café API is running..");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
