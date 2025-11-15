const express = require("express");
const deleteRouter = express.Router();
const cards = require("../models/Card.js");
const user = require("../models/User.js");
const jwt = require("jsonwebtoken");
const Folder = require("../models/folder.js");
const Card = require("../models/Card.js");
const createActivity = require("./activity.module.js");
deleteRouter.delete("/folder/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const userId = decode.checkUser._id;
  const folder = await Folder.findOneAndDelete({ _id: id, author: userId });
  await createActivity({
    title: "Folder Deleted",
    author: folder.author,
    activity: "deleted",
    entityId: folder._id,
    entityType: "folder",
    status:"success"
  })
  res.json({ data: folder });
});
deleteRouter.delete("/card/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const userId = decode.checkUser._id;
  const folder = await Card.findOneAndDelete({ _id: id, author: userId });
  await createActivity({
    title: "Card Deleted",
    author: folder.author,
    activity: "deleted",
    entityId: folder._id,
    entityType: "snippet",
    status:"success"
  })
  res.json({ data: folder });
});


module.exports = deleteRouter;
