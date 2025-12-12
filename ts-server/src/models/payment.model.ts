import mongoose, { Schema } from "mongoose";

export enum SheetType {
  NORMAL = "normal",
  PREMIUM = "premium",
  MATTE = "matte",
}

export interface IPaymentItems {
  size: string;
  sheet: SheetType;
  quantity: number;
  squareFeet: number;
  price: number;
  imageFormat: string;
  timestamp: Date;
}

export interface IPaymentDetails {
  success: boolean;
  items: IPaymentItems;
}

export const PaymentItemsSchema = new Schema<IPaymentItems>(
  {
    size: { type: String, required: true },
    sheet: { type: String, required: true },
    quantity: { type: Number, required: true },
    squareFeet: { type: Number, required: true },
    price: { type: Number, required: true },
    imageFormat: { type: String, required: true },
    timestamp: { type: Date, required: true },
  },
  { _id: false }
);

export const PaymentDetailsSchema = new Schema<IPaymentDetails>(
  {
    success: { type: Boolean, required: true },
    items: { type: PaymentItemsSchema, required: true },
  },
  { _id: false }
);

const paymentDetailsModel = mongoose.model(
  "paymentDetails",
  PaymentDetailsSchema
);
export default paymentDetailsModel;
