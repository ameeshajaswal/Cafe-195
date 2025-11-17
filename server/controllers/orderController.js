import Order from "../models/order.js";

// Create new order
export const createOrder = async (req, res) => {
  const {
    foodID,
    drinkID,
    food_name,
    drink_name,
    total_food_price,
    total_drink_price,
    total_price,
    orderID,
    UserID
  } = req.body;

  try {
    const order = await Order.create({
      foodID,
      drinkID,
      food_name,
      drink_name,
      total_food_price,
      total_drink_price,
      total_price,
      orderID,
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

    order.food_name = req.body.food_name ?? order.food_name;
    order.drink_name = req.body.drink_name ?? order.drink_name;
    order.foodID = req.body.foodID ?? order.foodID;
    order.drinkID = req.body.drinkID ?? order.drinkID;
    order.total_food_price = req.body.total_food_price ?? order.total_food_price;
    order.total_drink_price =
      req.body.total_drink_price ?? order.total_drink_price;
    order.total_price = req.body.total_price ?? order.total_price;
    order.orderID = req.body.orderID ?? order.orderID;
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
