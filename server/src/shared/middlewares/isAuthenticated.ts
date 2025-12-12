import { Request, Response, NextFunction } from "express";
import { CatchAsyncError } from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "./ErrorHandler.js";
import userModel from "../../models/user.model.js";


// authenticated user
export const isAuthenticated = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {

    try {
      const accessToken = req.cookies.access_token || req.headers.authorization?.split("")[1] as string;
      if (!accessToken) { return next(new ErrorHandler("Unauthorized! Token missing", 401)) }

      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!) as { id: string, role: "user" | "seller" };
      if (!decoded) { return next(new ErrorHandler("Unauthorized! Invalid token", 400)) }


      const account = await userModel.findById({ _id: decoded.id }).select("+password");
      if (!account) { return next(new ErrorHandler("Unauthorized! User not found", 404)) }

      req.user = account;
      next()
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 404))
    }
  }
);

// validate user role
export const authorizeRoles = (...roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const {id} = req?.user as any;

    const user: any = await userModel.findById(id);


    if (!roles.includes(user.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource`,
          403
        )
      );
    }
    next();
  };
};
