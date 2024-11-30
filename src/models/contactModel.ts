import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    isChecked: {
      type: Boolean,
      default: false,
    },
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Contact", contactSchema);
