import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    priceAfterDiscount: { type: String, required: true },
    discount: { type: String, required: false },
    quantity: { type: String, required: true },
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
      type: String,
      default: 0,
    },
    price: {
      type: String,
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
  { timestamps: false }
);

export type TProduct = Document & mongoose.InferSchemaType<typeof productSchema>;


export default mongoose.model("Product", productSchema);
