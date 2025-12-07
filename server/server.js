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

// Get __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// CORS configuration - allow Render frontend and local dev
const allowedOrigins = [
  'https://cafe-195-frontend.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

// API Routes
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/foods", foodRoutes);
app.use("/api/drinks", drinkRoutes);

// ---------------------- CART ROUTES ----------------------
// In-memory carts
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

// Drink cart endpoints
app.post("/api/drinkCart/reset", (req, res) => {
  drinkCart = {
    icedLatte: 0,
    icedChocolate: 0,
    icedCappuccino: 0,
    strawberrySmoothie: 0
  };
  res.json({ message: "Drink cart cleared" });
});

app.get("/api/drinkCart", (req, res) => {
  res.json(drinkCart);
});

app.post("/api/drinkCart/:item", (req, res) => {
  const { item } = req.params;
  const { quantity } = req.body;

  if (!Object.prototype.hasOwnProperty.call(drinkCart, item)) {
    return res.status(400).json({ error: "Drink item not found" });
  }

  drinkCart[item] = quantity;
  res.json(drinkCart);
});

app.post("/api/drinkCart/:item/:action", (req, res) => {
  const { item, action } = req.params;

  if (!Object.prototype.hasOwnProperty.call(drinkCart, item)) {
    return res.status(400).json({ error: "Drink item not found" });
  }

  if (action === "add") drinkCart[item] += 1;
  if (action === "remove" && drinkCart[item] > 0) drinkCart[item] -= 1;

  res.json(drinkCart);
});

// Food cart endpoints
app.post("/api/foodCart/reset", (req, res) => {
  foodCart = {
    croissant: 0,
    clubSandwich: 0,
    spaghetti: 0,
    kuyteav: 0
  };
  res.json({ message: "Food cart cleared" });
});

app.get("/api/foodCart", (req, res) => {
  res.json(foodCart);
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

app.post("/api/foodCart/:item/:action", (req, res) => {
  const { item, action } = req.params;

  if (!Object.prototype.hasOwnProperty.call(foodCart, item)) {
    return res.status(400).json({ error: "Food item not found" });
  }

  if (action === "add") foodCart[item] += 1;
  if (action === "remove" && foodCart[item] > 0) foodCart[item] -= 1;

  res.json(foodCart);
});

// Health check for Render
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "healthy",
    message: "Coffee Café API is running",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || "development"
  });
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("Coffee Café API is running..");
});

// For production - serve frontend files
// IMPORTANT: Path is different because server is in subdirectory
if (process.env.NODE_ENV === 'production') {
  // Calculate correct path: go up one level from server/, then into client/dist
  const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
  
  console.log(`Serving static files from: ${clientDistPath}`);
  
  // Serve static files from client/dist
  app.use(express.static(clientDistPath));
  
  // Handle SPA routing - all other routes go to index.html
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
}

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});