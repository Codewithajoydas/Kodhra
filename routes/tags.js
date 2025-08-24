const express = require("express");
const tagsRouter = express.Router();
const jwt = require("jsonwebtoken");
const Card = require("../models/Card");
tagsRouter.get("/", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const userId = decode.checkUser._id;
  const image = decode.checkUser.userImage;
  const userName = decode.checkUser.userName;

  try {
    const tags = await Card.find({ author: userId }).distinct("tags");
    res.render("tags", { tags, image, userName });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = tagsRouter;
