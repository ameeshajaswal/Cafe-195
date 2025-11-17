import Drink from "../models/drink.js";

// Create new drink
export const createDrink = async (req, res) => {
  const { drinkID, name, price, orderId } = req.body;

  try {
    const drink = await Drink.create({ drinkID, name, price, orderId });

    res.status(201).json(drink);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get ALL drinks
export const getDrinks = async (req, res) => {
  try {
    const drinks = await Drink.find();
    res.json(drinks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get drink by ID
export const getDrinkById = async (req, res) => {
  try {
    const drink = await Drink.findById(req.params.id);

    if (!drink) return res.status(404).json({ message: "Drink not found" });

    res.json(drink);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a drink
export const updateDrink = async (req, res) => {
  try {
    const drink = await Drink.findById(req.params.id);

    if (!drink) return res.status(404).json({ message: "Drink not found" });

    drink.drinkID = req.body.drinkID ?? drink.drinkID;
    drink.name = req.body.name ?? drink.name;
    drink.price = req.body.price ?? drink.price;
    drink.orderId = req.body.orderId ?? drink.orderId;

    const updatedDrink = await drink.save();
    res.json(updatedDrink);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a drink
export const deleteDrink = async (req, res) => {
  try {
    const drink = await Drink.findById(req.params.id);

    if (!drink) return res.status(404).json({ message: "Drink not found" });

    await drink.deleteOne();
    res.json({ message: "Drink deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
