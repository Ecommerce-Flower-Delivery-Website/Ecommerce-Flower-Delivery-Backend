import mongoose, { Schema, Document } from "mongoose";
import  { InferSchemaType } from "mongoose";



export interface IUserReference {
  user: mongoose.Types.ObjectId; 
  deliveryFrequency: string; 
  deliveryCount: string; 
}

export interface ISubscribe extends Document {
  title: string;
  image: string;
  price: string;
  isFreeDelivery?: string;
  discount?: string;
  features: string[];
  users_id?: IUserReference[]; 
}



const userReferenceSchema = new Schema<IUserReference>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  deliveryFrequency: {
    type: String,
    required: true,
  },
  deliveryCount: {
    type: String,
    required: true,
  },
});


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
      type: String,
      required: true,
    },
    isFreeDelivery: {
      type: String,
      default: "0",
    },
    discount: {
      type: String,
    },
    features: {
      type: [String],
      required: true,
    },

    users_id: {
      type: [userReferenceSchema],
    },
  },
  { timestamps: true }
);


export type subscribeType = Document & InferSchemaType<typeof subscribeSchema>;
export default mongoose.model<subscribeType>("Subscribe", subscribeSchema);
