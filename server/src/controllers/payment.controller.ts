// import { NextFunction, Response, Request } from "express";
// import { CatchAsyncError } from "../shared/middlewares/catchAsyncErrors.js";
// import PaymentDetailsModel from "../models/payment.model.js";

// export const getAllPrinting = CatchAsyncError(
//     async (req: Request, res: Response, next: NextFunction) => {
//         const { _id, printing } = req.user;
//         const payments = printing.map((item: any) => await PaymentDetailsModel.find({ user: _id }););


//         return res.status(200).json({
//             success: true,
//             count: prints.length,
//             prints,
//         });
//     }
// );