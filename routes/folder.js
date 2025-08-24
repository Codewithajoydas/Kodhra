const express = require("express");
const folderRouter = express.Router();
const cards = require("../models/Card.js");
const user = require("../models/User.js");
const jwt = require("jsonwebtoken");
const Folder = require("../models/folder.js");
folderRouter.get("/:userId/:folderId", async (req, res) => {
  const { userId, folderId } = req.params;
  const findFolder = await Folder.findOne({ author: userId, _id: folderId });
  res.json({ data: findFolder });
});

folderRouter.get("/", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const userId = decode.checkUser._id;
  const image = decode.checkUser.userImage;
  const folders = await Folder.find({ author: userId });
  res.render("folder", { folders, image, userId });
});
folderRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const folder = await Folder.findById({ _id: id });
  res.json({ data: folder });
});
folderRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const userId = decode.checkUser._id;
  const folder = await Folder.findByIdAndDelete({ _id: id, author: userId });
  res.json({ data: folder });
});

module.exports = folderRouter;
