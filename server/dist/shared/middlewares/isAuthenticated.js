import { CatchAsyncError } from "./catchAsyncErrors.js";
import jwt from "jsonwebtoken";
import ErrorHandler from "./ErrorHandler.js";
import userModel from "../../models/user.model.js";
// authenticated user
export const isAuthenticated = CatchAsyncError(async (req, res, next) => {
    try {
        // Get token from cookies OR "Bearer token"
        const accessToken = req.cookies.access_token || (req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : undefined);
        if (!accessToken) {
            return next(new ErrorHandler("Unauthorized! Token missing", 401));
        }
        // Verify token
        const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
        if (!decoded) {
            return next(new ErrorHandler("Unauthorized! Invalid token", 400));
        }
        // Find user
        const account = await userModel
            .findById(decoded.id)
            .select("+password");
        if (!account) {
            return next(new ErrorHandler("Unauthorized! User not found", 404));
        }
        req.user = account;
        next();
    }
    catch (error) {
        // Token verification errors
        return next(new ErrorHandler(error.message || "Authentication failed", 401));
    }
});
// validate user role
export const authorizeRoles = (...roles) => {
    return async (req, res, next) => {
        const { _id } = req?.user;
        const user = await userModel.findById({ _id: _id });
        if (!roles.includes(user.role || "")) {
            return next(new ErrorHandler(`Role: ${user.role} is not allowed to access this resource`, 403));
        }
        next();
    };
};
