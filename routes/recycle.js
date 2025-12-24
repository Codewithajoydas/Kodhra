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
  const cards = await CardDB.find({ author: _id, isDeleted: true }).populate(
    "author",
    "userName userImage"
  );
  const card = await findFavPinned(cards, _id);
  const folders = await folder.find({ author: _id, isDeleted: false });
  const folderData = await folder.find({ author: _id, isDeleted: true });
  res.render("recyclebin", {
    card,
    image: userImage,
    author: userName,
    userId: _id,
    folders,
    folderData,
  });
});

recyclebinRouter.put("/folder/:id", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id, userName, userImage } = decode.checkUser;
  const folderId = req.params.id;
  const folders = await folder.findOne({
    _id: folderId,
    author: _id,
    isDeleted: true,
  });
  if (!folders) return res.status(404).json({ error: "Folder not found" });
  await folder.findByIdAndUpdate(folderId, { author: _id, isDeleted: false });
  res.status(200).json({ message: "Folder deleted successfully" });
});

recyclebinRouter.put("/card/:id", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id, userName, userImage } = decode.checkUser;
  const cardId = req.params.id;
  const card = await CardDB.findById(cardId, { author: _id, isDeleted: true });
  if (!card) return res.status(404).json({ error: "Card not found" });
  await CardDB.findByIdAndUpdate(cardId, { author: _id, isDeleted: false });
  res.status(200).json({ message: "Card deleted successfully" });
});

module.exports = recyclebinRouter;
