"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const discountSchema = new mongoose_1.default.Schema({
    codeGift: {
        type: String,
        trim: true,
        required: true,
    },
    discountGift: {
        type: Number,
        required: true,
    },
    users_id: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "User",
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Discount", discountSchema);
