import mongoose from "mongoose";

const accessorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      required: true,
    },
    image: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    products_array: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Product",
    },
  },
  { timestamps: false }
);

export type TAccessory = Document & mongoose.InferSchemaType<typeof accessorySchema>;

export default mongoose.model("Accessory", accessorySchema);
