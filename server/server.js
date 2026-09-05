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

// Optional local environment file; existing platform variables take precedence.
dotenv.config({ path: path.join(__dirname, "..", ".env"), quiet: true });

const app = express();

// CORS configuration - allow the deployed frontend and local development
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
  'http://localhost:3000'
].filter(Boolean);

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
const requireDatabase = async (_req, res, next) => {
  try {
    await connectDB();
  } catch {
    // Keep the runtime available for health checks and connection retries.
    console.error("❌ MongoDB connection unavailable");
    return res.status(503).json({ message: "Database temporarily unavailable" });
  }
  next();
};

app.use("/api/users", requireDatabase, userRoutes);
app.use("/api/orders", requireDatabase, orderRoutes);
app.use("/api/foods", requireDatabase, foodRoutes);
app.use("/api/drinks", requireDatabase, drinkRoutes);

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

// Public liveness check; intentionally independent of database availability.
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy" });
});

// Root endpoint
app.get("/", (req, res) => {
  res.send("Coffee Café API is running..");
});

// Local startup fails fast. Vercel connects inside database-backed requests.
if (!process.env.VERCEL) {
  try {
    await connectDB();
  } catch {
    console.error("❌ MongoDB connection failed; check MONGO_URI and database access");
    process.exit(1);
  }
}

// Vercel natively supports this listener, as does the existing local npm command.
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});
