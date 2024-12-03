import mongoose, { Schema, Document } from "mongoose";

export interface ISubscribe extends Document {
  title: string;
  image: string;
  price: number;
  isFreeDelivery?: boolean;
  discount?: number;
  features: string[];
  deliveryFrequency: string;
  deliveryCount: number;
  users_id?: mongoose.Types.ObjectId[];
}


const subscribeSchema = new Schema<ISubscribe>(
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
    features: {
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

const Subscribe = mongoose.model("Subscribe", subscribeSchema);

export default Subscribe;
