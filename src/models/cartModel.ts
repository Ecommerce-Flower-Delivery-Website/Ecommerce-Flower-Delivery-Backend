import mongoose, { Document } from "mongoose";
import { TProduct } from "./productModel";
import { TAccessory } from "./accessoryModel";
import { UserType } from "./userModel";

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        accessoriesId: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: "Accessory",
        },
        price: {
          type: Number,
          default: 0,
        },
        priceAfterDiscount: {
          type: Number,
          default: 0,
        },
      },
    ],
    priceAll: {
      type: Number,
      default: 0,
    },
    priceAllAfterDiscount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: false }
);

export type TCart =  Document & mongoose.InferSchemaType<typeof cartSchema> & {
  userId: mongoose.Types.ObjectId | UserType;
  items?: Array<{
    productId: mongoose.Types.ObjectId | TProduct;
    accessoriesId?: mongoose.Types.ObjectId[] | TAccessory[];
    price?: number;
    priceAfterDiscount?: number;
  }>;
  priceAll?: number;
  priceAllAfterDiscount?: number;
};

export default mongoose.model("Cart", cartSchema);
