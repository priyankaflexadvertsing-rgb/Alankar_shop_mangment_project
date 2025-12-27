import { CatchAsyncError } from "./catchAsyncErrors.js";
import ErrorHandler from "./ErrorHandler.js";
import userModel from "../../models/user.model.js";
import PrintingFileModel from "../../models/printing.model.js";
// authenticated user
export const isPrintingStatus = CatchAsyncError(async (req, res, next) => {
    try {
        const { printingId } = req.params;
        const { _id } = req.user;
        const printingFile = await PrintingFileModel.findOne({ _id: printingId });
        if (!printingFile) {
            return next(new ErrorHandler("Printing file not found", 404));
        }
        const user = await userModel.findById(_id);
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }
        if (user.role === "admin" || printingFile) {
            return next();
        }
        if (printingFile.status === "processing" || printingFile.status === "completed") {
            return next(new ErrorHandler(`you Cannot modify printing file in ${printingFile.status} status, yet this time only admin can modify`, 403));
        }
        next();
    }
    catch (error) {
        return next(new ErrorHandler(error.message || "Authentication failed", 401));
    }
});
