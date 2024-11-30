"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const accessorySchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
    description: {
        type: String,
    },
    price: {
        type: Number,
        required: true,
    },
    products_array: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "Product",
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Accessory", accessorySchema);
