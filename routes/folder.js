const express = require("express");
const folderRouter = express.Router();
const cards = require("../models/Card.js");
const user = require("../models/User.js");
const jwt = require("jsonwebtoken");
const Folder = require("../models/folder.js");
const Card = require("../models/Card.js");
const bson = require("bson");
const { default: mongoose } = require("mongoose");
const archiver = require("archiver");

folderRouter.get("/userid/:userId/folderid/:folderId", async (req, res) => {
  const { userId, folderId } = req.params;
  const findFolder = await Folder.findOne({ author: userId, _id: folderId });
  res.json({ data: findFolder });
});

folderRouter.get("/all", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const userId = decode.checkUser._id;
  const folder = await Folder.find({ author: userId, isDeleted: false });
  let folderNames = folder.map((folder) => folder.folderName);
  res.json({ data: folderNames });
});

folderRouter.post("/create", async (req, res) => {
  const { folderName } = req.body;

  try {
    const token = req.cookies.token;
    const decode = jwt.verify(token, process.env.SECRET);
    const userId = decode.checkUser._id;

    const existing = await Folder.find({
      folderName: new RegExp(`^${folderName}`),
      author: userId,
    });

    let finalName = folderName;

    if (existing.length > 0) {
      finalName = `${folderName}-(${existing.length})`;
    }

    const newFolder = new Folder({
      folderName: finalName,
      author: userId,
    });

    await newFolder.save();

    res.json({ data: newFolder });
  } catch (error) {
    res.json({ error: error.message });
  }
});

folderRouter.get("/", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const userId = decode.checkUser._id;
  const image = decode.checkUser.userImage;
  const folders = await Folder.find({
    author: userId,
    isDeleted: false,
  }).populate("author");
  const strg = bson.calculateObjectSize(folders);
  res.render("folder", { folders, image, userId });
});

folderRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const userId = decode.checkUser._id;
  const image = decode.checkUser.userImage;
  const author = decode.checkUser.userName || decode.checkUser.login;
  try {
    const folder = await Folder.findById(id);
    if (!folder) {
      return res
        .status(404)
        .json({ error: "Folder not found please provide folder name!" });
    }
    const folders = await Folder.find({ parent: id }).populate("author");
    const folderName = await Folder.findOne({ _id: id, author: userId }).select(
      "folderName"
    );
    const getCardId = folder.cards.map((e) => e._id);
    const card = await Card.find({ _id: { $in: getCardId } }).populate("author");
    res.render("folderCards", {
      card,
      folders,
      image,
      userId,
      author,
      fName: folderName.folderName,
      app_url: process.env.APP_URL,
    });
  } catch (error) {
    res.json({ "Internal Server Error": error.message });
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

folderRouter.post("/delete", async (req, res) => {
  const { selected } = req.body;
  const ids = selected.map((id) => new mongoose.Types.ObjectId(id));
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const userId = decode.checkUser._id;
  await Folder.updateMany(
    { _id: { $in: ids }, author: userId },
    { $set: { isDeleted: true } }
  );
  res.json({ data: "Deleted Successfully" });
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

async function addFolderToZip(archive, folder, userId) {
  const path = `${folder.fullPath}/`;
  archive.append(
    JSON.stringify(
      {
        folderName: folder.folderName,
        cards: folder.cards,
        parent: folder.parent,
      },
      null,
      2
    ),
    { name: `${path}data.json` }
  );

  const childFolders = await Folder.find({
    parent: folder._id,
    author: userId,
  });
  for (const child of childFolders) {
    child.fullPath = `${folder.fullPath}/${child.folderName}`;
    await addFolderToZip(archive, child, userId);
  }
}

folderRouter.post("/download", async (req, res) => {
  try {
    const token = req.cookies.token;
    const decode = jwt.verify(token, process.env.SECRET);
    const userId = decode.checkUser._id;
    const { selected } = req.body;

    if (!selected || selected.length === 0) {
      return res.status(400).json({ error: "No folder selected" });
    }

    const rootFolders = await Folder.find({
      _id: { $in: selected },
      author: userId,
    });

    if (rootFolders.length === 0) {
      return res.status(404).json({ error: "Folder not found" });
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader("Content-Disposition", "attachment; filename=folders.zip");

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    for (const folder of rootFolders) {
      folder.fullPath = folder.folderName;
      await addFolderToZip(archive, folder, userId);
    }

    await archive.finalize();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
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

folderRouter.get("/all", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const userId = decode.checkUser._id;
  const folder = await Folder.find({ author: userId });
  let folderNames = folder.map((folder) => folder.folderName);
  res.json({ folderNames });
});
module.exports = folderRouter;
