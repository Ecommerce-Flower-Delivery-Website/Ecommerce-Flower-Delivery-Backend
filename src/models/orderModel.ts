import mongoose from "mongoose";
import { string } from "zod";

const orderSchema = new mongoose.Schema(
  {
    array_product: {
      type: [
        {
          title: { type: String, required: true },
          image: { type: String, required: true },
          priceAfterDiscount: { type: Number, required: true },
          discount: { type: Number },
          quantity: { type: Number, required: true },
        },
      ],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    discountGift: {
      type: Number,
    },
    discountSubscribe: {
      type: Number,
    },
    cart_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    recipientName: {
      type: String,
      required: true,
    },
    recipientPhone: {
      type: String,
      required: true,
    },
    dateDelivery: {
      type: Date,
      required: true,
    },
    deliveryDate: {
      type: String,
      required: true,
    },
    street: {
      type: String,
    },
    apartmentNumber: {
      type: Number,
    },
    dontKnowAddress: {
      type: Boolean,
      default: true,
    },
    cardNumber: {
      type: String,
      required: true,
    },
    cvvCode: {
      type: String,
      required: true,
    },
    isDone: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
