import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

// DRINK CART
let drinkCart = {
  icedLatte: 0,
  icedChocolate: 0,
  icedCappuccino: 0,
  strawberrySmoothie: 0
};

// FOOD CART
let foodCart = {
  croissant: 0,
  clubSandwich: 0,
  spaghetti: 0,
  kuyteav: 0
};

// ---------------------- RESET CARTS ----------------------


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

// ---------------------- GET CARTS ----------------------




// GET drink cart
app.get("/api/drinkCart", (req, res) => {
  res.json(drinkCart);
});

// GET food cart
app.get("/api/foodCart", (req, res) => {
  res.json(foodCart);
});




// ---------------------- SET QUANTITY ----------------------

// Update drink quantity
app.post("/api/drinkCart/:item", (req, res) => {
  const { item } = req.params;
  const { quantity } = req.body;

  if (!drinkCart.hasOwnProperty(item)) {
    return res.status(400).json({ error: "Drink item not found" });
  }

  drinkCart[item] = quantity;
  res.json(drinkCart);
});

// Update food quantity
app.post("/api/foodCart/:item", (req, res) => {
  const { item } = req.params;
  const { quantity } = req.body;

  if (!foodCart.hasOwnProperty(item)) {
    return res.status(400).json({ error: "Food item not found" });
  }

  foodCart[item] = quantity;
  res.json(foodCart);
});

// ---------------------- ADD / REMOVE ----------------------

// drinks add/remove
app.post("/api/drinkCart/:item/:action", (req, res) => {
  const { item, action } = req.params;

  if (!drinkCart.hasOwnProperty(item)) {
    return res.status(400).json({ error: "Drink item not found" });
  }

  if (action === "add") drinkCart[item] += 1;
  if (action === "remove" && drinkCart[item] > 0) drinkCart[item] -= 1;

  res.json(drinkCart);
});

// food add/remove
app.post("/api/foodCart/:item/:action", (req, res) => {
  const { item, action } = req.params;

  if (!foodCart.hasOwnProperty(item)) {
    return res.status(400).json({ error: "Food item not found" });
  }

  if (action === "add") foodCart[item] += 1;
  if (action === "remove" && foodCart[item] > 0) foodCart[item] -= 1;

  res.json(foodCart);
});

app.listen(5000, () => console.log("API running on port 5000"));
