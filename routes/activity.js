const express = require("express");
const jwt = require("jsonwebtoken");
const activity = require("../models/activity");
const activityRouter = express.Router();

activityRouter.get("/", async (req, res) => {
    const token = req.cookies.token;
    const decode = jwt.verify(token, process.env.SECRET);
    const userId = decode.checkUser._id;
    const activityA = await activity.find({ author: userId }).sort({ createdAt: -1 });
    res.json({ data: activityA });
})

module.exports = activityRouter;
