const express = require("express");
const cardRouter = express.Router();
const cardSchema = require("../models/Card");
const jwt = require("jsonwebtoken");
const Card = require("../models/Card");
const Folder = require("../models/folder");
const mongoose = require("mongoose");
cardRouter.get("/", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id, userName, email, userImage } = decode.checkUser;
  const card = await cardSchema.find({ author: _id });
  res.render("allCards", { card, image: userImage, userName });
});
cardRouter.get("/create", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id, userName, email, userImage } = decode.checkUser;
  res.render("newCard", { id: _id, name: userName, email, image: userImage });
});




cardRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;

  try {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid Card ID" });
      }
    const dlecard = await cardSchema.findByIdAndDelete(id);
    res.json({ 200: "Card Deleted Successfully" });
  } catch (error) {
    res.json(error);
  }
});

cardRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Card ID" });
    }
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id, userName, userImage } = decode.checkUser;
  const card = await cardSchema.findOne({ _id: id });
  res.render("editCard", { card, image: userImage, userName });
});

cardRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Card ID" });
    }
  const { title, description, content, imageUrl, tags, category } = req.body;
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id, userName, userImage } = decode.checkUser;
  const card = await cardSchema.find({ _id });
  const editcard = await cardSchema.findByIdAndUpdate(
    id,
    { title, description, content, imageUrl, tags, category },
    { new: true, runValidators: true }
  );
  res.json({ editcard });
});

cardRouter.put("/pin/:id", async (req, res) => {
  try {
    const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid Card ID" });
      }
    const card = await Card.findById(id);

    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    card.isPinned = !card.isPinned; // toggle
    await card.save();

    res.json({
      success: true,
      message: `Card ${card.isPinned ? "pinned" : "unpinned"} successfully`,
      card,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err });
  }
});

cardRouter.put("/fav/:id", async (req, res) => {
  try {
    const id = req.params.id;
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ error: "Invalid Card ID" });
      }
    const card = await Card.findById(id);

    if (!card) {
      return res
        .status(404)
        .json({ success: false, message: "Card not found" });
    }

    card.isFavorite = !card.isFavorite; // toggle
    await card.save();

    res.json({
      success: true,
      message: `Card ${
        card.isFavorite ? "favorited" : "unfavorited"
      } successfully`,
      card,
    });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Server error", error: err });
  }
});



module.exports = cardRouter;
