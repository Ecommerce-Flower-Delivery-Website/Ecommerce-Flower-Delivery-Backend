import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
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

export type TProduct = 
  mongoose.InferSchemaType<typeof productSchema> & {
    _id: mongoose.Types.ObjectId;
  };

export default mongoose.model("Product", productSchema);
