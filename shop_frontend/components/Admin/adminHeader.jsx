import React, { useEffect, useState } from "react";
import { IoMdNotificationsOutline } from "react-icons/io";
import { SERVER_URI, SOCKET_URI } from "../../uri/uril";
import socketIO from "socket.io-client";
import { apiFetch } from "../../src/hooks/fetchInstance";
import { Bell, BellDot } from "lucide-react";
const ENDPOINT = SOCKET_URI || "";
const socketId = socketIO(ENDPOINT, { transports: ["websocket"] });

const DashboardHeader = ({ open, setOpen }) => {
  const [notifications, setNotifications] = useState([]);
  const [audio] = useState(
    typeof window !== "undefined" &&
      new Audio(
        "https://res.cloudinary.com/dkg6jv4l0/video/upload/v1716750964/notification_jvwqd0.mp3"
      )
  );

  const playNotificationSound = () => audio.play();

  // Fetch notifications from backend
  const fetchNotifications = async () => {
    try {
      const res = await apiFetch("/notification-get");
      const data = await res.json();

      if (data && data.notifications) {
        const unread = data.notifications.filter(
          (item) => item.status === "unread"
        );

        setNotifications(unread);

        if (unread.length > 0) playNotificationSound();
      }
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    audio.load();
  }, []);

  // Listen for socket realtime notifications
  useEffect(() => {
    socketId.on("newNotification", (data) => {
      console.log("Realtime notification:", data);
      fetchNotifications();
      playNotificationSound();
    });

    return () => {
      socketId.off("newNotification");
      socketId.off("connect");
    };
  }, []);

  // Mark notification as read
  const handleNotificationStatusChange = async (id) => {
    try {
      const res = await apiFetch(`/update_nottification/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "read" }),
      });

      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n._id !== id));
      }
    } catch (err) {
      console.error("Error updating notification:", err);
    }
  };

  return (
    <>
      <div className="relative cursor-pointer " onClick={() => setOpen(!open)}>
        <Bell className="h-6 w-6 cursor-pointer text-black dark:text-white" />

        <span
          className="absolute -top-2 -right-2 bg-[#3ccba0] rounded-full w-[20px] h-[20px]
                    text-[12px] flex items-center justify-center text-white"
        >
          {notifications.length}
        </span>
      </div>

      {open && (
        <div
          className="w-[350px] h-[60vh] overflow-y-scroll py-3 px-2
                    border border-[#ffffff0c] dark:bg-[#111C43] bg-white shadow-xl
                    absolute top-16 z-[1000000000] rounded"
        >
          <h5 className="text-center text-[20px] font-Poppins text-black dark:text-white p-3">
            Notifications
          </h5>

          {notifications.map((item, index) => (
            <div
              key={index}
              className="dark:bg-[#2d3a4e] bg-[#00000013] font-Poppins
                                border-b dark:border-b-[#ffffff47] border-b-[#0000000f]"
            >
              <div className="w-full flex items-center justify-between p-2">
                <p className="text-black dark:text-white">{item.title}</p>

                <p
                  className="text-black dark:text-white cursor-pointer"
                  onClick={() => handleNotificationStatusChange(item._id)}
                >
                  Mark as read
                </p>
              </div>

              <p className="px-2 text-black dark:text-white">{item.message}</p>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default DashboardHeader;
