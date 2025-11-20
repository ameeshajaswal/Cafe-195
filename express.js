import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

let cart = {
  icedLatte: 0,
  icedChocolate: 0,
  icedCappuccino: 0,
  strawberrySmoothie: 0
};

// GET all cart values
app.get("/api/cart", (req, res) => {
  res.json(cart);
});

// UPDATE one drink quantity
app.post("/api/cart/:drink", (req, res) => {
  const { drink } = req.params;
  const { quantity } = req.body;

  if (!cart.hasOwnProperty(drink)) {
    return res.status(400).json({ error: "Drink not found" });
  }

  cart[drink] = quantity;
  res.json(cart);
});

// OPTIONAL: increment or decrement
app.post("/api/cart/:drink/:action", (req, res) => {
  const { drink, action } = req.params;

  if (!cart.hasOwnProperty(drink)) {
    return res.status(400).json({ error: "Drink not found" });
  }

  if (action === "add") cart[drink] += 1;
  if (action === "remove" && cart[drink] > 0) cart[drink] -= 1;

  res.json(cart);
});

app.listen(5000, () => console.log("API running on port 5000"));
