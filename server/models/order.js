import mongoose from "mongoose";

const lineItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    subtotal: { type: Number, required: true }
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    drinkItems: {
      type: [lineItemSchema],
      default: []
    },
    foodItems: {
      type: [lineItemSchema],
      default: []
    },
    total_food_price: {
      type: Number,
      required: true
    },
    total_drink_price: {
      type: Number,
      required: true
    },
    total_price: {
      type: Number,
      required: true
    },
    orderNumber: {
      type: Number,
      required: true,
      unique: true
    },
    UserID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model("Order", orderSchema);

export default Order;
