const express = require("express");
const folderRouter = express.Router();
const cards = require("../models/Card.js");
const user = require("../models/User.js");
const jwt = require("jsonwebtoken");
const Folder = require("../models/folder.js");
const Card = require("../models/Card.js");

folderRouter.get("/userid/:userId/folderid/:folderId", async (req, res) => {
  const { userId, folderId } = req.params;
  const findFolder = await Folder.findOne({ author: userId, _id: folderId });
  res.json({ data: findFolder });
});

folderRouter.get("/all", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const userId = decode.checkUser._id;
  const folder = await Folder.find({ author: userId });
  let folderNames = folder.map((folder) => folder.folderName);
  res.json({ data: folderNames });
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
  try {
    const { id } = req.params;
    const folder = await Folder.findById({ _id: id });
    res.json({ data: folder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

folderRouter.delete("/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const userId = decode.checkUser._id;
  const folder = await Folder.findByIdAndDelete({ _id: id, author: userId });

  res.json({ data: folder });
});

folderRouter.put("/:id", async (req, res) => {
  const { folderName } = req.body;
  const { id } = req.params;
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const userId = decode.checkUser._id;
  const folder = await Folder.findByIdAndUpdate(
    { _id: id, author: userId },
    { folderName: folderName },
    { new: true }
  );
  res.json({ data: folder });
});

folderRouter.put("/pin/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const userId = decode.checkUser._id;
  const folder = await Folder.findByIdAndUpdate(
    { _id: id, author: userId },
    { $set: { ispinned: !folder.ispinned } },
    { new: true }
  );
  res.json({ data: folder });
});
// folderRouter.post("/add/:id", async (req, res) => {
//   const { folderName } = req.body;
//   const token = req.cookies.token;
//   const decode = jwt.verify(token, process.env.SECRET);
//   const userId = decode.checkUser._id;
//   const folder = await Folder.create({ folderName, author: userId });
//   res.json({ data: folder });
// });

folderRouter.put("/:id", async (req, res) => {
  const { folderName } = req.body;
  const { id } = req.params;
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const userId = decode.checkUser._id;
  const folder = await Folder.findByIdAndUpdate(
    { _id: id, author: userId },
    { folderName: folderName },
    { new: true }
  );
  res.json({ data: folder });
});

folderRouter.put("/move/:id", async (req, res) => {
  try {
    const { folderName } = req.body;
    const { id } = req.params;
    const token = req.cookies.token;
    const decode = jwt.verify(token, process.env.SECRET);
    const userId = decode.checkUser._id;
    const findParent = await Folder.findOne({
      folderName,
      author: userId,
    });
    if (!findParent) {
      return res.status(404).json({ error: "Parent folder not found" });
    }
    const childFolder = await Folder.findOne({ _id: id, author: userId });
    if (!childFolder) {
      return res.status(404).json({ error: "Child folder not found" });
    }
    childFolder.parent = findParent._id;
    await childFolder.save();
    res.json({
      message: "Folder moved successfully",
      folder: childFolder,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

folderRouter.put("/movecard/:id", async (req, res) => {
  try {
    let { id } = req.params; // card ID
    let { folderName } = req.body; // folder name
    const token = req.cookies.token;
    const decode = jwt.verify(token, process.env.SECRET);
    const userId = decode.checkUser._id;
    const findCard = await Folder.findOne({ folderName, author: userId });
    if (!findCard) {
      res.json({ message: "Folder not found" });
    }
    const checkCard = findCard.cards.includes(id);
    if (!checkCard) {
      findCard.cards.push(id);
      await findCard.save();
      res.json({ message: "Card added to folder successfully" });
    } else {
      res.json({ message: "Card already in folder" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = folderRouter;
