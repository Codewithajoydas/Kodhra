const express = require("express");
const folderRouter = express.Router();
const cards = require("../models/Card.js");
const user = require("../models/User.js");

folderRouter.get("/:userId/:folderId", async (req, res) => {
  const { userId, folderId } = req.params;
  const findFolder = await cards.findOne({ author: userId, _id: folderId });
  res.json({ data: findFolder });
});
module.exports = folderRouter;
