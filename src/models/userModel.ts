import mongoose, { InferSchemaType, model } from "mongoose";
import bcryptjs from "bcryptjs";
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
      required: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      select: false,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    emailConfirmToken: {
      type: String,
    },
    emailConfirmExpires: {
      type: Date,
    },
    googleId: {
      type: String,
    },
    subscribe_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export type UserType = InferSchemaType<typeof userSchema>;

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcryptjs.hash(this.password, 8);
  next();
});

async function comparePassword(this: UserType, enteredPassword: string) {
  return await bcryptjs.compare(enteredPassword, this.password);
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