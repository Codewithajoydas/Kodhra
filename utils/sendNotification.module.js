const { getIO } = require("../routes/socket");
const Notification = require("../models/notification");

async function sendNotification(title, message, link, userId) {
  const newNotification = await Notification.create({
    userId,
    title,
    message,
    link,
    isRead: false,
  });

  const unreadCount = await Notification.countDocuments({
    userId,
    isRead: false,
  });

  const io = getIO();
  io.to(userId.toString()).emit("notification", {
    _id: newNotification._id,
    title: newNotification.title,
    message: newNotification.message,
    link: newNotification.link,
    unreadCount,
    createdAt: newNotification.createdAt,
  });
}

module.exports = sendNotification;
