"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reminderSchema = new mongoose_1.default.Schema({
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
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "User",
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Reminder", reminderSchema);
