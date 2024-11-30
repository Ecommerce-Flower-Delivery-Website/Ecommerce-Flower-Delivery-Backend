"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    image: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
    },
    category_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    accessory_id: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "Accessory",
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Product", productSchema);
