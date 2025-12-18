import mongoose, { Schema } from "mongoose";
export var PrintingType;
(function (PrintingType) {
    PrintingType["FLEX"] = "flex";
    PrintingType["PAPER"] = "paper";
    PrintingType["VINYL"] = "vinyl";
    PrintingType["OTHER"] = "other";
})(PrintingType || (PrintingType = {}));
export const PrintingFileSchema = new Schema({
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
    status: { type: String, required: true, default: "pending", enum: ["pending", "processing", "completed", "failed"] },
    // 🔗 RELATION
    payment_details: {
        type: Schema.Types.ObjectId,
        ref: "PaymentDetails",
        required: false,
    },
    encoding: { type: String, required: true },
    mimetype: { type: String, required: true },
    size: { type: Number, required: true },
}, { timestamps: true });
const PrintingFileModel = mongoose.models.PrintingFile ||
    mongoose.model("PrintingFile", PrintingFileSchema);
export default PrintingFileModel;
