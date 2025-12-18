import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { CatchAsyncError } from "../shared/middlewares/catchAsyncErrors.js";
import { checkOtpRestrictions, existingUser, handleForgetPassword, sendOtp, trackOtpRequests, validationRegistrationData, verifyForgetPassword, verifyOtp, } from "../shared/utils/auth.helper.js";
import ErrorHandler from "../shared/middlewares/ErrorHandler.js";
import userModel from "../models/user.model.js";
import { setCookie } from "../shared/utils/setCookies.js";
import notificationModel from "../models/notification.model.js";
import printingFileModel from "../models/printing.model.js";
import { printingRateConfig } from "../config/rate-cofig.js";
dotenv.config();
// =====================
// User Registration
// =====================
export const userRegistration = CatchAsyncError(async (req, res, next) => {
    try {
        validationRegistrationData(req.body, "user");
        const { name, email } = req.body;
        // MUST be awaited
        await existingUser(email, next);
        await checkOtpRestrictions(email, next);
        await trackOtpRequests(email, next);
        const { token } = createActivationToken(req.body);
        await sendOtp(email, "activation-mail.ejs", name);
        return res.status(201).json({
            success: true,
            token,
            message: `Please check your email: ${email} to activate your account!`,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});
export const createActivationToken = (user) => {
    const token = jwt.sign(user, process.env.ACTIVATION_SECRET, {
        expiresIn: "5m",
    });
    return { token };
};
export const userActivate = async (req, res, next) => {
    try {
        const { token, otp } = req.body;
        if (!token || !otp) {
            return next(new ErrorHandler("Invalid activation details", 400));
        }
        let newUser;
        try {
            newUser = jwt.verify(token, process.env.ACTIVATION_SECRET);
        }
        catch (err) {
            return next(new ErrorHandler("Invalid or expired activation token", 400));
        }
        const { name, email, password } = newUser;
        const existUser = await userModel.findOne({ email });
        if (existUser) {
            return next(new ErrorHandler("Email already exists", 400));
        }
        await verifyOtp(email, otp, next);
        await userModel.create({
            name,
            email,
            password,
            rate: printingRateConfig,
        });
        await notificationModel.create({
            title: "New user",
            message: `new user account is create name:${name} & email:${email}`,
        });
        return res.status(201).json({
            success: true,
            message: "Account activated successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
};
export const userLogin = CatchAsyncError(async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new ErrorHandler("Please enter email and password", 400));
        }
        const user = await userModel.findOne({ email }).select("+password").exec();
        if (!user)
            return next(new ErrorHandler("Invalid email or password", 404));
        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            return next(new ErrorHandler("Invalid email or password", 404));
        }
        const accessToken = user.SignAccessToken("user");
        const refreshToken = user.SignRefreshToken("user");
        setCookie("refresh_token", refreshToken, res);
        setCookie("access_token", accessToken, res);
        return res.status(200).json({
            message: `Login Successfully`,
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
// forget password
export const userForgetPassword = async (req, res, next) => {
    await handleForgetPassword(req, res, next, "user");
};
// verify user forget password
export const verifyUserForgetPassword = async (req, res, next) => {
    await verifyForgetPassword(req, res, next, "user");
};
// rest user password
export const resetUserPassword = async (req, res, next) => {
    try {
        const { email, newPassword } = req.body;
        const user = await userModel.findOne({ email });
        if (!user) {
            return next(new ErrorHandler("Invalid email or password", 400));
        }
        const isPasswordSame = await user.comparePassword(newPassword);
        if (!isPasswordSame) {
            return next(new ErrorHandler("New password cannot be the same as the old password!", 500));
        }
        const hashPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashPassword;
        await user.save();
        res.status(200).json({
            message: `Password reset successfully `,
        });
    }
    catch (error) {
        next(error.message);
    }
};
// update access token
export const refreshToken = CatchAsyncError(async (req, res, next) => {
    try {
        const refreshToken = req.cookies.refresh_token;
        if (!refreshToken) {
            return next(new ErrorHandler("Unautorized! No token ", 404));
        }
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
        if (!decoded) {
            return next(new ErrorHandler("forbidden! Invalid refresh token", 500));
        }
        const user = await userModel
            .findById({ _id: decoded.id })
            .select("+password");
        if (!user) {
            return next(new ErrorHandler("Forbidden! User/Seller not found", 400));
        }
        const newAccessToken = user.SignAccessToken(decoded.role);
        setCookie("access_token", newAccessToken, res);
        return res.status(201).json({ success: true });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});
// logout user
export const userLoggedOut = CatchAsyncError(async (req, res, next) => {
    try {
        res.cookie("access_token", "", { maxAge: 1 });
        res.cookie("refresh_token", "", { maxAge: 1 });
        res.status(200).json({
            success: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});
// get user info
export const userGet = CatchAsyncError(async (req, res, next) => {
    try {
        const user = req.user;
        res.status(201).json({ success: true, user });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});
// social Auth
export const socialAuth = CatchAsyncError(async (req, res, next) => {
    const { email, name, avatar } = req.body;
    let user = await userModel.findOne({ email });
    // If user exists → login
    if (user) {
        const accessToken = user.SignAccessToken("user");
        const refreshToken = user.SignRefreshToken("user");
        setCookie("refresh_token", refreshToken, res);
        setCookie("access_token", accessToken, res);
        return res.status(200).json({
            message: "Login Successfully",
            user,
        });
    }
    // Otherwise → create new user
    const account = { email: email, name: name, avatar: avatar };
    const newUser = await userModel.create(account);
    const accessToken = newUser.SignAccessToken("user");
    const refreshToken = newUser.SignRefreshToken("user");
    setCookie("refresh_token", refreshToken, res);
    setCookie("access_token", accessToken, res);
    return res.status(200).json({
        message: "Login Successfully",
        user: newUser,
    });
});
// get all users --- only for admin
export const getTeamMembers = CatchAsyncError(async (req, res, next) => {
    try {
        const users = await userModel.find().sort({ createdAt: -1 });
        const teamMember = users.filter((item, index) => item.role !== "user");
        res.status(201).json({
            success: true,
            teamMember,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});
// get all users --- only for admin
export const userGetAll = CatchAsyncError(async (req, res, next) => {
    try {
        const users = await userModel
            .find()
            .sort({ createdAt: -1 })
            .populate("printing");
        const usersWithPayments = await Promise.all(users.map(async (user) => {
            const paymentDetails = await printingFileModel.find({ user: user._id }).populate("payment_details").sort({ createdAt: -1 });
            return {
                ...user.toObject(),
                payment_details: paymentDetails,
            };
        }));
        res.status(200).json({
            success: true,
            usersWithPayments,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 400));
    }
});
export const editUserProfile = CatchAsyncError(async (req, res, next) => {
    try {
        const { _id } = req.user;
        if ("rate" in req.body) {
            return next(new ErrorHandler("Not allowed to update rate", 403));
        }
        if (!_id) {
            return next(new ErrorHandler("Unauthorized", 401));
        }
        const { name, image } = req.body;
        const user = await userModel.findById({ _id: _id });
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }
        if (name)
            user.name = name;
        if (image)
            user.image = image;
        await user.save();
        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
export const adminEditUser = CatchAsyncError(async (req, res, next) => {
    try {
        const { userId, name, image, rate, role } = req.body;
        if (!userId) {
            return next(new ErrorHandler("User ID is required", 400));
        }
        const user = await userModel.findById(userId).select("+rate");
        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }
        if (name)
            user.name = name;
        if (image)
            user.image = image;
        if (role)
            user.role = role;
        /** ✅ Deep merge rate */
        if (rate && typeof rate === "object") {
            user.rate = {
                ...(user.rate || {}),
                ...Object.keys(rate).reduce((acc, key) => {
                    acc[key] = {
                        ...(user.rate?.[key] || {}),
                        ...rate[key],
                    };
                    return acc;
                }, {}),
            };
        }
        await user.save();
        return res.status(200).json({
            success: true,
            message: "User updated successfully",
            user,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
