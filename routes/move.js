const express = require("express");
const jwt = require("jsonwebtoken");
const moveRouter = express.Router();
const Folder = require("../models/folder");
const Card = require("../models/Card");
const { find } = require("../models/User");
const { getIO } = require("./socket");
const sendNotification = require("../utils/sendNotification.module");
const folder = require("../models/folder");

moveRouter.put("/folder/:parentId/:childId", async (req, res) => {
  try {
    const { parentId, childId } = req.params;
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: "No token provided" });
    }

    const decode = jwt.verify(token, process.env.SECRET);
    const userId = decode.checkUser._id;

    const parentFolder = await Folder.findOne({
      _id: parentId,
      author: userId,
    });
    if (!parentFolder) {
      return res.status(404).json({ error: "Parent folder not found" });
    }

    const childFolder = await Folder.findOne({ _id: childId, author: userId });
    if (!childFolder) {
      return res.status(404).json({ error: "Child folder not found" });
    }

    if (parentId === childId) {
      return res
        .status(400)
        .json({ error: "Invalid move: cannot move a folder into itself" });
    }

    if (childFolder.path.includes(parentId)) {
      return res
        .status(400)
        .json({ error: "Invalid move: circular reference" });
    }

    await Folder.updateOne(
      { _id: childId },
      {
        $set: {
          path: [...parentFolder.path, parentId],
          parent: parentId,
        },
      }
    );

    res.json({ message: "Folder moved successfully" });
  } catch (err) {
    console.error("Error moving folder:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

moveRouter.put("/card/:parentId/:childId", async (req, res) => {
  const { childId, parentId } = req.params;
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const userId = decode.checkUser._id;
  const findFolder = await Folder.findOne({ author: userId, _id: parentId });
  if (!findFolder) {
    return res.status(404).json({ error: "Folder not found" });
  }
  const findCard = await Card.findOne({ _id: childId });
  if (!findCard) {
    return res.status(404).json({ error: "Card not found" });
  }
  const ispresent = findFolder.cards.includes(childId);
  if (ispresent) {
    return res.status(400).json({ error: "Card already present in folder" });
  }
  findFolder.cards.push(childId);
  await findFolder.save();
  sendNotification(
    "Card Moved",
    `Card moved to folder ${findFolder.folderName}`,
    `/folder/${findFolder._id}`,
    userId
  );
  res.json({ message: "Card moved to folder successfully" });
});

module.exports = moveRouter;
