import { NextFunction, Response, Request } from "express";
import { CatchAsyncError } from "../shared/middlewares/catchAsyncErrors.js";
import ErrorHandler from "../shared/middlewares/ErrorHandler.js";
import FilesService from "../services/file.js";
import path from "path";
import fs from "fs";
import notificationModel from "../models/notification.model.js";
import printingFileModel from "../models/printing.model.js";
import userModel from "../models/user.model.js";
import PaymentsService from "../services/calculateUserAmount.js";
import PrintingFileModel from "../models/printing.model.js";

export const uploadPrinting = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.user;
    const files = req.files as Express.Multer.File[];

    const rate = {
      normal: 7,
      bb: 12,
      star: 18,
      vinyle: 25,
    }

    if (!files || files.length === 0) {
      return next(new ErrorHandler("No files uploaded", 400));
    }

    const user = await userModel.findById(_id);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    const createdPrintings = [] as any;

    for (const file of files) {
      const {
        fieldname,
        originalname,
        encoding,
        mimetype,
        destination,
        filename,
        path: inputFilePath,
        size,
      } = file;

      /** Compress file */
      const compressedFilePath = await FilesService.compressImagesFiles(
        inputFilePath
      );

      if (!compressedFilePath) {
        return next(new ErrorHandler("File compression failed", 500));
      }


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




      const newPrintingData: any = {
        printingtype: "flex",
        originalfilePath: path.join(destination, filename),
        compressedfilePath: compressedFilePath,
        payment_details,
        fieldname,
        originalname,
        encoding,
        mimetype,
        size,
        user: _id,
      }

      /** Create printing record */
      const printing: any = await printingFileModel.create(newPrintingData);
      await PrintingFileModel.create(newPrintingData);


      user.printing.push(printing._id);
      createdPrintings.push(printing);

      const notification = {
        title: "Printing Upload",
        message: `${originalname} uploaded successfully`,
        user: _id,
      };

      await notificationModel.create(notification);
    }

    await user.save();

    res.status(201).json({
      success: true,
      message: "Files uploaded successfully",
      data: createdPrintings,
    });
  }
);

export const getAllPrinting = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { _id } = req.user;

    const prints = await printingFileModel.find({ user: _id }).populate("payment_details")
      .sort({ createdAt: -1 });;

    res.status(200).json({
      success: true,
      count: prints.length,
      prints,
    });
  }
);

export const updatePrinting = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const {userId} = req.body;

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
  }
);

export const deletePrinting = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const {userId} = req.body;


    const user = await userModel.findById({_id:userId});
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
    if (
      printing.compressedfilePath &&
      fs.existsSync(printing.compressedfilePath)
    ) {
      fs.unlinkSync(printing.compressedfilePath);
    }

    /** Delete DB record */
    await printing.deleteOne();

    res.status(200).json({
      success: true,
      message: "Printing file deleted successfully",
    });
  }
);
