const express = require("express");
const jwt = require("jsonwebtoken");
const CardDB = require("../models/Card");
const folder = require("../models/folder");
const findFavPinned = require("../utils/findFavPin.module");
const recyclebinRouter = express.Router();

recyclebinRouter.get("/", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id, userName, userImage } = decode.checkUser;
  const cards = await CardDB.find({ author: _id, isDeleted: true }).populate("author", "userName userImage");
  const card = await findFavPinned(cards, _id);
  const folders = await folder.find({ author: _id });
  res.render("recyclebin", {
    card,
    image: userImage,
    author: userName,
    userId: _id,
    folders,
  });
});

module.exports = recyclebinRouter;
