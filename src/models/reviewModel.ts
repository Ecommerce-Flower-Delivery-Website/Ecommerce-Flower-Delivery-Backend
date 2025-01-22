import mongoose from "mongoose";
import { boolean } from "zod";

const reviewSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    text: {
      type: String,
      trim: true,
      required: true,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Review", reviewSchema);
