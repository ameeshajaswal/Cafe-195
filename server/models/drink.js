import mongoose from "mongoose";

const drinkSchema = new mongoose.Schema(
  {
    drinkID: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
    },
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Order",
    },
  },
  {
    timestamps: true,
  }
);

const Drink = mongoose.model("Drink", drinkSchema);

export default Drink;
