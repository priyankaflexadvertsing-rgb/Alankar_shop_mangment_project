import mongoose, { Schema } from "mongoose";


export enum PrintingType {
  FLEX = "flex",
  PAPER = "paper",
  VINYL = "vinyl",
  OTHER = "other",
}

export interface IPrintingFile {
  user: mongoose.Types.ObjectId;
  printingtype: PrintingType;
  originalfilePath: string;
  compressedfilePath: string;
  fieldname: string;
  originalname: string;
  payment_details?: mongoose.Types.ObjectId; // ✅ reference
  encoding: string;
  mimetype: string;
  size: number;
}

export const PrintingFileSchema = new Schema<IPrintingFile>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    printingtype: {
      type: String,
      enum: Object.values(PrintingType),
      required: true,
    },
    originalfilePath: { type: String, required: true },
    compressedfilePath: { type: String, required: true },
    fieldname: { type: String, required: true },
    originalname: { type: String, required: true },

    // 🔗 RELATION
    payment_details: {
      type: Schema.Types.ObjectId,
      ref: "PaymentDetails",
      required: false,
    },

    encoding: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: true }
);

const PrintingFileModel =
  mongoose.models.PrintingFile ||
  mongoose.model<IPrintingFile>("PrintingFile", PrintingFileSchema);

export default PrintingFileModel;
