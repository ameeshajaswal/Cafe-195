import Order from "../models/order.js";
import Counter from "../models/counter.js";

// Create new order
export const createOrder = async (req, res) => {
  const {
    foodItems = [],
    drinkItems = [],
    total_food_price,
    total_drink_price,
    total_price,
    UserID
  } = req.body;

  try {
    if (!foodItems.length && !drinkItems.length) {
      return res.status(400).json({ message: "Order must contain at least one item" });
    }

    const counter = await Counter.findOneAndUpdate(
      { _id: "orderNumber" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const nextOrderNumber = counter.seq;

    const order = await Order.create({
      foodItems,
      drinkItems,
      total_food_price,
      total_drink_price,
      total_price,
      orderNumber: nextOrderNumber,
      UserID
    });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all orders
export const getOrders = async (_req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update an order
export const updateOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.foodItems = req.body.foodItems ?? order.foodItems;
    order.drinkItems = req.body.drinkItems ?? order.drinkItems;
    order.total_food_price = req.body.total_food_price ?? order.total_food_price;
    order.total_drink_price =
      req.body.total_drink_price ?? order.total_drink_price;
    order.total_price = req.body.total_price ?? order.total_price;
    order.UserID = req.body.UserID ?? order.UserID;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    await order.deleteOne();
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
