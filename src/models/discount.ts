import mongoose from "mongoose";

const discountSchema = new mongoose.Schema(
  {
    codeGift: {
      type: String,
      trim: true,
      required: true,
    },
    discountGift: {
      type: Number,
      required: true,
    },
    users_id: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Discount", discountSchema);
