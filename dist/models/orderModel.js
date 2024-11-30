"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderSchema = new mongoose_1.default.Schema({
    array_product: {
        type: [
            {
                title: { type: String, required: true },
                image: { type: String, required: true },
                priceAfterDiscount: { type: Number, required: true },
                discount: { type: Number, required: false },
                quantity: { type: Number, required: true },
            },
        ],
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    discountGift: {
        type: Number,
    },
    discoutnSubscribe: {
        type: Number,
    },
    cart_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Cart",
        required: true,
    },
    recipientName: {
        type: String,
        required: true,
    },
    recipientPhone: {
        type: String,
        required: true,
    },
    dateDelivery: {
        type: Date,
        required: true,
    },
    timeDelivery: {
        type: String,
        required: true,
    },
    address: {
        type: {
            street: String,
            appartmentNumber: Number,
        },
        required: true,
    },
    doesKnowAddress: {
        type: Boolean,
        default: true,
    },
    cardNumber: {
        type: String,
        required: true,
    },
    cvvCode: {
        type: String,
        required: true,
    },
}, { timestamps: true });
exports.default = mongoose_1.default.model("Order", orderSchema);
