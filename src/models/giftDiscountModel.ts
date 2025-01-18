import mongoose from "mongoose";

const giftDiscountSchema = new mongoose.Schema(
  {
    codeGift: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    discountGift: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("GiftDiscount", giftDiscountSchema);
