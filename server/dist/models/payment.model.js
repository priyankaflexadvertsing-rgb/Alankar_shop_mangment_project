import mongoose, { Schema } from "mongoose";
/**
 * Sheet Types
 */
export var SheetType;
(function (SheetType) {
    SheetType["NORMAL"] = "normal";
    SheetType["PREMIUM"] = "premium";
    SheetType["MATTE"] = "matte";
})(SheetType || (SheetType = {}));
/**
 * Payment Item Schema
 */
export const PaymentItemSchema = new Schema({
    size: {
        type: String,
        required: true,
        trim: true,
    },
    sheet: {
        type: String,
        enum: Object.values(SheetType),
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    squareFeet: {
        type: Number,
        required: true,
        min: 0,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    imageFormat: {
        type: String,
        required: true,
        lowercase: true,
    },
    timestamp: {
        type: Date,
        default: Date.now,
        required: true,
    },
}, { _id: false });
/**
 * Payment Details Schema
 */
export const PaymentDetailsSchema = new Schema({
    success: {
        type: Boolean,
        required: true,
        index: true,
    },
    // 🔗 Payment calculation result
    items: {
        type: PaymentItemSchema,
        required: true,
    },
    // 💰 Optional but recommended
    totalAmount: {
        type: Number,
        min: 0,
    },
    currency: {
        type: String,
        default: "INR",
        uppercase: true,
    },
}, {
    timestamps: true,
    versionKey: false,
});
/**
 * Model
 */
const PaymentDetailsModel = mongoose.models.PaymentDetails ||
    mongoose.model("PaymentDetails", PaymentDetailsSchema);
export default PaymentDetailsModel;
