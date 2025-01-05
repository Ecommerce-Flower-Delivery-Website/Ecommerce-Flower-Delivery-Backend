import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    priceAfterDiscount: { type: Number, required: true },
    discount: { type: Number, required: false },
    quantity: { type: Number, required: true },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    image: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: true,
    },
    category_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    accessory_id: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Accessory",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
