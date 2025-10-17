const express = require("express");
const cardRouter = express.Router();
const cardSchema = require("../models/Card");
const jwt = require("jsonwebtoken");
const Card = require("../models/Card");
const Folder = require("../models/folder");
const mongoose = require("mongoose");
const findFavPinned = require("../utils/findFavPin.module");
const User = require("../models/User");
cardRouter.get("/", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id, userName, email, userImage } = decode.checkUser;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
  const skip = (page - 1) * limit;
  const cards = await cardSchema
    .find({ author: _id })
    .populate("author", "userName userImage")
    .skip(skip)
    .limit(limit);
  let card = await findFavPinned(cards, _id);

  const len = await cardSchema.find({ author: _id }).countDocuments();
  const tags = await cardSchema.distinct("tags");
  const folders = await Folder.find({
    author: decode.checkUser._id,
  });

  res.render("allCards", {
    card,
    image: userImage,
    author: userName,
    userId: _id,
    len,
    folders,
    tags,
  });
});

cardRouter.get("/create", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);

  const { _id, userName, email, userImage } = decode.checkUser;
  res.render("newCard", {
    id: _id,
    name: userName,
    email,
    image: userImage,
    userId: _id,
  });
});

cardRouter.get("/json", async (req, res) => {
  try {
    const token = req.cookies.token;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 30;
    const skip = (page - 1) * limit;
    const decode = jwt.verify(token, process.env.SECRET);
    const { _id, userName, userImage } = decode.checkUser;
    const { search } = req.query;
    let query = { author: _id };
    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { content: { $regex: search, $options: "i" } },
          { tags: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
        ],
        author: _id,
      };
    }
    const cards = await cardSchema
      .find(query)
      .populate("author", "userName userImage")
      .skip(skip)
      .limit(limit);
    let card = await findFavPinned(cards, _id);
    res.render("partials/cards", {
      card,
      image: userImage,
      author: userName,
      userId: _id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

cardRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid Card ID" });
    }

    const deletedCard = await cardSchema.findByIdAndDelete(id);

    if (!deletedCard) {
      return res.status(404).json({ error: "Card not found" });
    }

    res.status(200).json({ message: "Card Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ error: "An unexpected error occurred" });
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
    const cardId = req.params.id;
    const token = req.cookies.token;
    const decode = jwt.verify(token, process.env.SECRET);
    const userId = decode.checkUser._id;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ error: "Invalid Card ID" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isPinned = user.pinnedCards.includes(cardId);

    if (isPinned) {
      user.pinnedCards.pull(cardId); // remove
    } else {
      user.pinnedCards.push(cardId); // add
    }

    await user.save();

    res.json({
      success: true,
      message: `Card ${isPinned ? "unpinned" : "pinned"} successfully`,
      pinnedCards: user.pinnedCards,
    });
  } catch (err) {
    console.error("Error pinning card:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

cardRouter.put("/fav/:id", async (req, res) => {
  try {
    const cardId = req.params.id;
    const token = req.cookies.token;
    const decode = jwt.verify(token, process.env.SECRET);
    const userId = decode.checkUser._id;

    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ error: "Invalid Card ID" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isFavorite = user.favoriteCards.includes(cardId);

    if (isFavorite) {
      user.favoriteCards.pull(cardId); // remove
    } else {
      user.favoriteCards.push(cardId); // add
    }

    await user.save();

    res.json({
      success: true,
      message: `Card ${isFavorite ? "removed from" : "added to"} favorites`,
      favoriteCards: user.favoriteCards,
    });
  } catch (err) {
    console.error("Error favoriting card:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

cardRouter.post("/delete", (req, res) => {
  const getData = req.body.selected;

  try {
    cardSchema.deleteMany({ _id: { $in: getData } }).then(() => {
      res.json({ message: "Card deleted successfully" });
    });
  } catch (err) {
    res.json({ Error: "Something went wrong" });
  }
});

cardRouter.post("/download", async (req, res) => {
  try {
    const getSelectedData = req.body.selected;
    const cards = await Card.find({ _id: { $in: getSelectedData } });
    res.send(JSON.stringify(cards, null, 2));
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to download cards" });
  }
});

module.exports = cardRouter;
