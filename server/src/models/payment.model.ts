import mongoose, { Schema, Model, Types } from "mongoose";

/**
 * Sheet Types
 */
export enum SheetType {
  NORMAL = "normal",
  PREMIUM = "premium",
  MATTE = "matte",
}

/**
 * Payment Item Interface
 */
export interface IPaymentItem {
  size: string;
  sheet: SheetType;
  quantity: number;
  squareFeet: number;
  price: number;
  imageFormat: string;
  timestamp: Date;
}

/**
 * Payment Details Interface
 */
export interface IPaymentDetails {
  _id: Types.ObjectId;
  success: boolean;
  items: IPaymentItem;
  totalAmount?: number;
  currency?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Payment Item Schema
 */
export const PaymentItemSchema = new Schema<IPaymentItem>(
  {
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
  },
  { _id: false }
);

/**
 * Payment Details Schema
 */
export const PaymentDetailsSchema = new Schema<IPaymentDetails>(
  {
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
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

/**
 * Model
 */
const PaymentDetailsModel: Model<IPaymentDetails> =
  mongoose.models.PaymentDetails ||
  mongoose.model<IPaymentDetails>("PaymentDetails", PaymentDetailsSchema);

export default PaymentDetailsModel;
