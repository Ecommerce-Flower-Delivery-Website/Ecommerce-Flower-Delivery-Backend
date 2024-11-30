"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const subscribeSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    isFreeDelivery: {
        type: Boolean,
        default: true,
    },
    discount: {
        type: Number,
    },
    fetures: {
        type: [String],
        required: true,
    },
    deliveryFrequency: {
        type: String,
        required: true,
    },
    deliveryCount: {
        type: Number,
        required: true,
    },
    users_id: {
        type: [mongoose_1.default.Schema.Types.ObjectId],
        ref: "User",
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Subscribe", subscribeSchema);
