import Food from "../models/food.js";


export const createFood = async (req, res) => {
  const { name, price, orderId } = req.body;

  try {
    const food = await Food.create({ name, price, orderId });

    res.status(201).json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get ALL food items
export const getFoods = async (req, res) => {
  try {
    const foods = await Food.find();
    res.json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get food by ID
export const getFoodById = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) return res.status(404).json({ message: "Food not found" });

    res.json(food);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a food item
export const updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) return res.status(404).json({ message: "Food not found" });

    food.name = req.body.name || food.name;
    food.price = req.body.price || food.price;
    food.orderId = req.body.orderId || food.orderId;

    const updatedFood = await food.save();
    res.json(updatedFood);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a food item
export const deleteFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) return res.status(404).json({ message: "Food not found" });

    await food.deleteOne();
    res.json({ message: "Food deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
