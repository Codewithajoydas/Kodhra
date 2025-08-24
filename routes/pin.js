const express = require("express");
const pinRouter = express.Router();
const jwt = require("jsonwebtoken");
const Card = require("../models/Card");
pinRouter.get("/", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const userId = decode.checkUser._id;
  const image = decode.checkUser.userImage;
  const userName = decode.checkUser.userName;

  try {
    const pinned = await Card.find({ author: userId, isPinned: true });
    res.render("pinned", { card: pinned, image, userName, author: userName });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = pinRouter;
