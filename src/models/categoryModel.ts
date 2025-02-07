import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
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
    description: {
      type: String,
      trim: true,
    },
    products: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: 'Product'
    }
  },
  { timestamps: true }
);  

export default mongoose.model("Category", categorySchema);
