import mongoose from "mongoose";

const passwordResetSchema = new mongoose.Schema(
  {
    passwordResetToken: {
      type: String,
      required: true,
    },
    passwordResetExpires: {
      type: Date,
      required: true,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("PasswordReset", passwordResetSchema);
