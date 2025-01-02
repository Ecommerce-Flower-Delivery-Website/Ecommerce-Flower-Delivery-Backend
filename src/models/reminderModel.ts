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
    }
  },
  { timestamps: true }
);

export default mongoose.model("Reminder", reminderSchema);
