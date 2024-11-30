"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const reviewSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        trim: true,
        required: true,
    },
    text: {
        type: String,
        trim: true,
        required: true,
    },
    shouldShow: {
        type: Boolean,
        default: false,
    },
    user_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Review", reviewSchema);
