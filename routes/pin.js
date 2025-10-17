const express = require("express");
const pinRouter = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Folder = require("../models/folder");
const findFavPinned = require("../utils/findFavPin.module");

pinRouter.get("/", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id: userId, userImage: image, userName } = decode.checkUser;

  try {
    const user = await User.findById(userId).populate({
      path: "pinnedCards",
      populate: { path: "author", select: "userName userImage _id" },
      options: { limit: 10 },
    });
    const card = await findFavPinned(user.pinnedCards, userId);
    const folders = await Folder.find({ author: userId });

    res.render("pinned", {
      card: card,
      image,
      author: userName,
      userId,
      folders,
    });
  } catch (error) {
    console.error("Error fetching Pinned cards:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

pinRouter.get("/json", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id: userId, userImage, userName } = decode.checkUser;

  const { page = 1, limit = 10 } = req.query;

  try {
    const user = await User.findById(userId).populate({
      path: "pinnedCards",
      populate: { path: "author", select: "userName userImage" },
      options: {
        skip: (page - 1) * limit,
        limit: parseInt(limit),
      },
    });
    const card = await findFavPinned(user.pinnedCards, userId);
    res.render("partials/cards", {
      card: card,
      image: userImage,
      author: userName,
      userId,
    });
  } catch (error) {
    console.error("Error fetching paginated pinned cards:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = pinRouter;
