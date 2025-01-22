// import bcryptjs from "bcryptjs";
import CryptoJS from "crypto-js";

import mongoose, { Document, InferSchemaType, model } from "mongoose";
// import bcryptjs from "bcryptjs";
import { subscribeType } from "./subscribeModel";
import cartModel from "./cartModel";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true
    },
    password: {
      type: String,
      required: true,
      trim: true,
      // select: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    emailConfirmToken: {
      type: String,
    },
    isAccountVerified: {
      type:Boolean,
      default: false,
  },
    googleId: {
      type: String,
    },
    subscribe_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subscribe",
    },
    isReminder: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);
type UserType = Document & InferSchemaType<typeof userSchema> & {
  subscribe_id?: mongoose.Types.ObjectId | subscribeType;
};
export type { UserType };
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
   this.password=  CryptoJS.AES.encrypt(this.password,process.env.JWT_SECRET!).toString()
    // this.password = await bcryptjs.hash(this.password, 8);
  }
  next();
});
async function comparePassword(this: UserType, enteredPassword: string) {
  // return await bcryptjs.compare(enteredPassword, this.password);
  const existedPassword = CryptoJS.AES.decrypt(this.password.toString(), process.env.JWT_SECRET!).toString(CryptoJS.enc.Utf8)

  return (existedPassword===enteredPassword)
}
userSchema.methods.comparePassword = comparePassword;

async function toFrontend(this: UserType) {
  this.password = "";
  return this;
}
userSchema.methods.toFrontend = toFrontend;
export const User = model<
  UserType & {
    comparePassword: typeof comparePassword;
    toFrontend: typeof toFrontend;
  }
>("User", userSchema);

export default mongoose.model<
  UserType & {
    comparePassword: typeof comparePassword;
    toFrontend: typeof toFrontend;
  }
>("User", userSchema);

