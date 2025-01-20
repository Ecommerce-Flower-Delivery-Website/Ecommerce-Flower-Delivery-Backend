import mongoose from "mongoose";
import { UserType } from "./userModel";
import { TProduct } from "./productModel";
import { TAccessory } from "./accessoryModel";

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
        productQuantity: {
          type: Number,
          required: true,
        },
        accessoriesId: {
          type: [mongoose.Schema.Types.ObjectId],
          ref: "Accessory",
        },
      },
    ],
    priceAll: {
      type: Number,
      defaultValue: 0,
    },
    productsCount: {
      type: Number,
      defaultValue: 0,
    },
  },
  { timestamps: false }
);

// export type TCart = mongoose.InferSchemaType<typeof cartSchema>;

export type TCart = Document &
  mongoose.InferSchemaType<typeof cartSchema> & {
    userId: mongoose.Types.ObjectId | UserType;
    items?: Array<{
      productId: mongoose.Types.ObjectId | TProduct;
      accessoriesId?: mongoose.Types.ObjectId[] | TAccessory[];
      price?: number;
    }>;
    priceAll?: number;
    productsCount: number;
  };

export default mongoose.model("Cart", cartSchema);
