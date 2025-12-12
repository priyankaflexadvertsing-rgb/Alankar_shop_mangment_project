import { NextFunction, Request, Response } from "express";
import crypto from "crypto";
import sendMail from "./sendMail.js";
import userModel from "../../models/user.model.js";
import ErrorHandler from "../middlewares/ErrorHandler.js";
import redis from "../../config/redis.js";

// const emailRegex = /^[^\s@']+@[^\s@]+\.[^\s@]+$/;

// check user is exists or not this email
export const existingUser = async (
  email: string,
  next: NextFunction,
  password?: string
) => {
  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return next(new ErrorHandler("User already exists with this email", 400));
  }

  return existingUser;
};

// validation user data
export const validationRegistrationData = async (
  data: any,
  userType: "user" | "seller"
) => { };

// validation user data
export const checkOtpRestrictions = async (
  email: string,
  next: NextFunction
) => {
  if (await redis.get(`otp_lock:${email}`)) {
    return next(
      new ErrorHandler(
        "Account locked due to multiple failed attempts ! Try again after 30 mintues",
        500
      )
    );
  }
  if (await redis.get(`otp_spam_lock:${email}`)) {
    return next(
      new ErrorHandler(
        "Too may OTP requests! Please wait 1hours before requesting again",
        500
      )
    );
  }
  if (await redis.get(`otp_cooldown:${email}`)) {
    return next(
      new ErrorHandler("Please wait 1minute before requesting a new otp!", 500)
    );
  }
};

// send Otp
export const sendOtp = async (
  email: string,
  template: string,
  name: string
) => {
  const otp = crypto.randomInt(1000, 9999).toString();
  const options = {
    email: email,
    subject: "Verify Your Email",
    template: template,
    data: { name, otp },
  };

  await sendMail(options);
  await redis.set(`otp:${email}`, otp, "EX", 300);
  await redis.set(`opt_cooldown:${email}`, "true", "EX", 60);
};

// verify Otp
export const verifyOtp = async (email: string, otp: string, next:NextFunction) => {
  const otpKey = `otp:${email}`;
  const failedAttemptsKey = `otp_failed_attempts:${email}`;
  const lockKey = `otp_lock:${email}`;

  // Check if user is locked
  const isLocked = await redis.get(lockKey);
  if (isLocked) {
    return next(new ErrorHandler(
      "Account locked due to multiple failed OTP attempts! Try again after 30 minutes.",
      400
    ));
  }

  const storedOtp = await redis.get(otpKey);

  if (!storedOtp) {
    return next(new ErrorHandler("OTP expired! Please request a new one.", 400));
  }

  const failedAttempts = parseInt((await redis.get(failedAttemptsKey)) || "0");

  // Invalid OTP
  if (otp !== storedOtp) {
    const newFailedAttempts = failedAttempts + 1;
    await redis.set(failedAttemptsKey, newFailedAttempts.toString(), "EX", 1800);

    if (newFailedAttempts > 3) {
      await redis.set(lockKey, "locked", "EX", 1800);
      await redis.del(otpKey);
      await redis.del(failedAttemptsKey);

    return next( new ErrorHandler(
        "Account locked due to multiple failed OTP attempts! Try again after 30 minutes.",
        400
      ));
    }

    return next(new ErrorHandler("Invalid OTP. Please try again.", 400));
  }

  // OTP correct → cleanup
  await redis.del(otpKey);
  await redis.del(failedAttemptsKey);
  return true
};



// track otp requests
export const trackOtpRequests = async (email: string, next: NextFunction) => {
  const optRequestKey = `otp_request_count:${email}`;
  let otpRequest = parseInt((await redis.get(optRequestKey)) || "0");

  if (otpRequest >= 2) {
    await redis.set(`otp_spam_lock:${email}`, "locked", "EX", 3600); // lock for 1hour
    return next(
      new ErrorHandler(
        "Too may OTP requests! Please wait 1hours before requesting again",
        500
      )
    );
  }
  await redis.set(optRequestKey, optRequestKey + 1, "EX", 3600); // Track request
};

// forget user Function
export const handleForgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userType: "user" | "seller"
) => {
  try {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      return next(new ErrorHandler("Invalid email", 500));
    }
    await checkOtpRestrictions(email, next);
    await trackOtpRequests(email, next);
    await sendOtp(email, "forget-password-mail", user.name);
    res.status(200).json({
      message: `OTP send to email. Please verify your account`,
    });
  } catch (error: any) {
    next(error.message);
  }
};

// verify forget user Function
export const verifyForgetPassword = async (
  req: Request,
  res: Response,
  next: NextFunction,
  userType: "user" | "seller"
) => {
  try {
    const { email, otp } = req.body;

    if (!email && !otp) {
      return next(new ErrorHandler("email & Otp required", 500));
    }

    await verifyOtp(email, otp, next);

    res.status(200).json({
      message: `OTP verifie. you can now rest your password`,
    });
  } catch (error: any) {
    next(error.message);
  }
};
