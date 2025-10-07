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
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
  const skip = (page - 1) * limit;
  const card = await cardSchema.find({ author: _id }).skip(skip).limit(limit);
  const len = await cardSchema.find({ author: _id }).countDocuments();
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

    const {search } = req.query;

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

    const card = await cardSchema.find(query).skip(skip).limit(limit);

    // Only render cards that match, or empty if none
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

cardRouter.post("/delete", (req, res) => {
  const getData = req.body.selected;
  console.log(getData);
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
