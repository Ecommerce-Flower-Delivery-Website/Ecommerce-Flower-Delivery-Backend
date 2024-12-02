import mongoose from "mongoose";

const reminderSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      trim: true,
    },
    festivalName: {
      type: String,
      required: true,
      trim: true,
    },
    festivalDate: {
      type: Date,
      required: true,
    },
    users_id: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
    },
    limitSend: {
      type: Number,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Reminder", reminderSchema);
