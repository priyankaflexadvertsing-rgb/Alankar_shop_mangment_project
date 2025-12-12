import mongoose, { Schema } from "mongoose";
import { PaymentDetailsSchema, IPaymentDetails } from "./payment.model.js";

export enum PrintingType {
  FLEX = "flex",
  PAPER = "paper",
  VINYL = "vinyl",
  OTHER = "other",
}

export interface IPrintingFile {
  _id: string;
  printingtpye: PrintingType;
  originalfilePath: string;
  compressedfilePath: string;
  fieldname: string;
  originalname: string;
  payment_details: IPaymentDetails;
  date: Date;
  encoding: string;
  mimetype: string;
  size: number;
}

export const PrintingFileSchema = new Schema<IPrintingFile>({
  _id: { type: String, required: true },
  printingtpye: { type: String, enum: Object.values(PrintingType), required: true },
  originalfilePath: { type: String, required: true },
  compressedfilePath: { type: String, required: true },
  fieldname: { type: String, required: true },
  originalname: { type: String, required: true },
  payment_details: { type: PaymentDetailsSchema, required: true },
  date: { type: Date, required: true },
  encoding: { type: String, required: true },
  mimetype: { type: String, required: true },
  size: { type: Number, required: true },
});

const printingFileModel = mongoose.model("printingFiles", PrintingFileSchema);
export default printingFileModel;
