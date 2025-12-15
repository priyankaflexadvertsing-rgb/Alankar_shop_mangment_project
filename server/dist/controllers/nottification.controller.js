import { CatchAsyncError } from "../shared/middlewares/catchAsyncErrors.js";
import notificationModel from "../models/notification.model.js";
import ErrorHandler from "../shared/middlewares/ErrorHandler.js";
import cron from "node-cron";
// get all notifications --- only admin
export const getNotifications = CatchAsyncError(async (req, res, next) => {
    try {
        const notifications = await notificationModel.find().sort({
            createdAt: -1,
        });
        res.status(201).json({
            success: true,
            notifications,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
// update notification status --- only admin
export const updateNotification = CatchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    try {
        const notification = await notificationModel.findById(id);
        if (!notification) {
            return next(new ErrorHandler("Notification not found", 404));
        }
        else {
            notification.status
                ? (notification.status = "read")
                : notification?.status;
        }
        await notification.save();
        const notifications = await notificationModel.find().sort({
            createdAt: -1,
        });
        res.status(201).json({
            success: true,
            notifications,
        });
    }
    catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
});
// delete notification --- only admin
cron.schedule("0 0 0 * * *", async () => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    await notificationModel.deleteMany({
        status: "read",
        createdAt: { $lt: thirtyDaysAgo },
    });
    console.log("Deleted read notifications");
});
