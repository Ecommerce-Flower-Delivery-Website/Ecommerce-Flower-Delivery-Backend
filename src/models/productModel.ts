import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
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
