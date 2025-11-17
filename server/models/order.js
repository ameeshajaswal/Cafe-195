import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    foodID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: true
    },
    drinkID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drink",
      required: true
    },
    food_name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Food",
      required: false
    },
    drink_name: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Drink",
      required: false
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
    orderID: {
      type: String,
      required: true,
      unique: true,
      trim: true
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
