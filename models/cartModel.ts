import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    hasDiscount: {
      type: Boolean,
      default: false,
    },
    totalAmount: {
      type: Number,
    },
    product_array: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Product",
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Cart", cartSchema);
