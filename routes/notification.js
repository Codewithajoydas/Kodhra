const express = require("express");
const notificationRouter = express.Router();
const jwt = require("jsonwebtoken");
const Notification = require("../models/notification");

notificationRouter.get("/", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const userId = decode.checkUser._id;
  const notifications = await Notification.find({ userId });
  res.json(notifications);
});

notificationRouter.get("/unread-count", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const userId = decode.checkUser._id;
  const count = await Notification.countDocuments({
    userId,
    isRead: false,
  });
  res.json({ count });
});

notificationRouter.post("/mark-read", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const userId = decode.checkUser._id;
  await Notification.updateMany(
    { userId, isRead: false }, 
    { $set: { isRead: true } } 
  );
  res.json({ success: true });
});

module.exports = notificationRouter;
