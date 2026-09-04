import Order from "../models/order.js";
import Counter from "../models/counter.js";
import {
  calculateOrderPricing,
  OrderPricingError
} from "../services/orderPricing.js";

const hasOwn = (value, property) =>
  Object.prototype.hasOwnProperty.call(value, property);

const selectionFromStoredItems = (items = []) =>
  items.map(({ productId, quantity }) => ({ productId, quantity }));

const calculateUpdatedPricing = (body, order) => {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new OrderPricingError("Order payload must be an object");
  }

  return calculateOrderPricing({
    foodItems: hasOwn(body, "foodItems")
      ? body.foodItems
      : selectionFromStoredItems(order.foodItems),
    drinkItems: hasOwn(body, "drinkItems")
      ? body.drinkItems
      : selectionFromStoredItems(order.drinkItems)
  });
};

const sendOrderError = (res, error, operation) => {
  if (error instanceof OrderPricingError) {
    return res.status(400).json({ message: error.message });
  }

  return res.status(500).json({ message: `Failed to ${operation} order` });
};

// Create new order
export const createOrder = async (req, res) => {
  try {
    const pricing = calculateOrderPricing(req.body);

    const counter = await Counter.findOneAndUpdate(
      { _id: "orderNumber" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    const nextOrderNumber = counter.seq;

    const order = await Order.create({
      ...pricing,
      orderNumber: nextOrderNumber,
      UserID: req.user._id
    });

    res.status(201).json(order);
  } catch (error) {
    return sendOrderError(res, error, "create");
  }
};

// Get all orders
export const getOrders = async (_req, res) => {
  try {
    const orders = await Order.find().populate("UserID", "name email");
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get orders for the current user
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ UserID: req.user._id });
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
    const isOwner = order.UserID.toString() === req.user._id.toString();
    if (req.user.role !== "admin" && !isOwner) {
      return res.status(404).json({ message: "Order not found" });
    }

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

    const pricing = calculateUpdatedPricing(req.body, order);
    order.foodItems = pricing.foodItems;
    order.drinkItems = pricing.drinkItems;
    order.total_food_price = pricing.total_food_price;
    order.total_drink_price = pricing.total_drink_price;
    order.total_price = pricing.total_price;
    order.UserID = req.body.UserID ?? order.UserID;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    return sendOrderError(res, error, "update");
  }
};

// Update an order (current user)
export const updateMyOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.UserID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this order" });
    }

    const pricing = calculateUpdatedPricing(req.body, order);
    order.foodItems = pricing.foodItems;
    order.drinkItems = pricing.drinkItems;
    order.total_food_price = pricing.total_food_price;
    order.total_drink_price = pricing.total_drink_price;
    order.total_price = pricing.total_price;

    const updatedOrder = await order.save();
    res.json(updatedOrder);
  } catch (error) {
    return sendOrderError(res, error, "update");
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

// Delete an order (current user)
export const deleteMyOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.UserID.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this order" });
    }

    await order.deleteOne();
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
