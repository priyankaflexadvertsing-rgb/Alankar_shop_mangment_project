import mongoose, { Schema } from "mongoose";

interface Inotification {
  title: string;
  message: string;
  status: string;
}

const notificationSchema = new Schema<Inotification>(
  {
    title: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      required: true,
      default: "unread",
    },
  },
  { timestamps: true }
);

const notificationModel = mongoose.model("Notification", notificationSchema);
export default notificationModel;
