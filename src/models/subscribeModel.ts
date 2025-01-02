import mongoose, { InferSchemaType } from "mongoose";

const subscribeSchema = new mongoose.Schema(
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
    price: {
      type: Number,
      required: true,
    },
    isFreeDelivery: {
      type: Boolean,
      default: true,
    },
    discount: {
      type: Number,
    },
    fetures: {
      type: [String],
      required: true,
    },
    deliveryFrequency: {
      type: String,
      required: true,
    },
    deliveryCount: {
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
export type subscribeType = InferSchemaType<typeof subscribeSchema>;
export default mongoose.model<subscribeType>("Subscribe", subscribeSchema);
