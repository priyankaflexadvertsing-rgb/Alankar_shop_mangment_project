import { CatchAsyncError } from "../shared/middlewares/catchAsyncErrors.js";
import ErrorHandler from "../shared/middlewares/ErrorHandler.js";
import FilesService from "../services/file.js";
import fs from "fs";
import notificationModel from "../models/notification.model.js";
import printingFileModel from "../models/printing.model.js";
import userModel from "../models/user.model.js";
import PaymentsService from "../services/calculateUserAmount.js";
export const uploadPrinting = CatchAsyncError(async (req, res, next) => {
    const { _id } = req.user;
    const files = req.files;
    const rate = {
        normal: 7,
        bb: 12,
        star: 18,
        vinyle: 25,
    };
    // 1️⃣ Validate files
    if (!files || files.length === 0) {
        return next(new ErrorHandler("No files uploaded", 400));
    }
    // 2️⃣ Find user
    const user = await userModel.findById(_id);
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    const createdPrintings = [];
    // 3️⃣ Process each file ONCE
    for (const file of files) {
        const { fieldname, originalname, encoding, mimetype, path: inputFilePath, size, } = file;
        // 4️⃣ Compress image (only once)
        const compressedFilePath = await FilesService.compressImagesFiles(inputFilePath, next);
        if (!compressedFilePath) {
            return next(new ErrorHandler("File compression failed", 500));
        }
        // 5️⃣ Calculate payment
        const payment_details = await PaymentsService.calculateUserAmount({
            printing: [
                {
                    fieldname,
                    originalname,
                    mimetype,
                    size,
                },
            ],
            rate,
        });
        // 6️⃣ Prepare DB data
        const newPrintingData = {
            printingtype: "flex",
            originalfilePath: inputFilePath, // ✅ FIXED
            compressedfilePath: compressedFilePath,
            payment_details,
            fieldname,
            originalname,
            encoding,
            mimetype,
            size,
            user: _id,
        };
        // 7️⃣ CREATE ONLY ONCE (🚫 duplication fixed)
        const printing = await printingFileModel.create(newPrintingData);
        // 8️⃣ Push reference to user
        user.printing.push(printing._id);
        createdPrintings.push(printing);
        // 9️⃣ Notification
        const notification = {
            title: "Printing Upload",
            message: `${originalname} uploaded successfully`,
            user: _id,
        };
        await notificationModel.create(notification);
    }
    // 🔟 Save user once
    await user.save();
    return res.status(201).json({
        success: true,
        message: "Files uploaded successfully",
        data: createdPrintings,
    });
});
export const getAllPrinting = CatchAsyncError(async (req, res, next) => {
    const { _id } = req.user;
    const prints = await printingFileModel
        .find({ user: _id })
        .populate("payment_details")
        .populate("user")
        .sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        count: prints.length,
        prints,
    });
});
export const updatePrinting = CatchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { userId } = req.body;
    const printing = await printingFileModel.findOne({
        _id: id,
        user: userId,
    });
    if (!printing) {
        return next(new ErrorHandler("Printing file not found", 404));
    }
    /** Fields that ARE allowed to be updated */
    const allowedFields = [
        "printingtype",
        "originalfilePath",
        "compressedfilePath",
        "fieldname",
        "originalname",
        "payment_details",
        "encoding",
        "mimetype",
        "size",
        "status",
    ];
    /** Apply updates safely */
    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            printing.set(field, req.body[field]);
        }
    });
    await printing.save();
    res.status(200).json({
        success: true,
        message: "Printing updated successfully",
        printing,
    });
});
export const deletePrinting = CatchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const { userId } = req.body;
    const user = await userModel.findById({ _id: userId });
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }
    const printing = await printingFileModel.findOne({
        _id: id,
        user: userId,
    });
    if (!printing) {
        return next(new ErrorHandler("Printing file not found", 404));
    }
    user.printing = user.printing.filter((pid) => pid.toString() !== id);
    await user.save();
    /** Delete original file */
    if (printing.originalfilePath && fs.existsSync(printing.originalfilePath)) {
        fs.unlinkSync(printing.originalfilePath);
    }
    /** Delete compressed file */
    if (printing.compressedfilePath &&
        fs.existsSync(printing.compressedfilePath)) {
        fs.unlinkSync(printing.compressedfilePath);
    }
    /** Delete DB record */
    await printing.deleteOne();
    res.status(200).json({
        success: true,
        message: "Printing file deleted successfully",
    });
});
// get all priniting by admin
export const allPrinting = CatchAsyncError(async (req, res, next) => {
    const prints = await printingFileModel
        .find()
        .populate("payment_details")
        .populate("user")
        .sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        count: prints.length,
        prints,
    });
});
export const updateprintingStatus = CatchAsyncError(CatchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const printingFile = await printingFileModel.findOne({ _id: id });
    if (!printingFile) {
        return next(new ErrorHandler("Printing file not found", 404));
    }
    if (printingFile.status === "pending") {
        printingFile.status = "processing";
    }
    else if (printingFile.status === "processing") {
        printingFile.status = "completed";
    }
    await printingFile.save();
    const prints = await printingFileModel
        .find()
        .populate("payment_details")
        .populate("user")
        .sort({ createdAt: -1 });
    res.status(200).json({
        success: true,
        count: prints.length,
        prints,
    });
}));
