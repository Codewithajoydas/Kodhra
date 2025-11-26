const express = require("express");
const cardRouter = express.Router();
const cardSchema = require("../models/Card");
const jwt = require("jsonwebtoken");
const Card = require("../models/Card");
const Folder = require("../models/folder");
const mongoose = require("mongoose");
const findFavPinned = require("../utils/findFavPin.module");
const User = require("../models/User");
const createActivity = require("./activity.module");
const { getIO } = require("./socket");
cardRouter.get("/", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id, userName, email, userImage } = decode.checkUser;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 30;
  const skip = (page - 1) * limit;
  const cards = await cardSchema
    .find({ author: _id, isDeleted: false })
    .populate("author", "userName userImage")
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });
  let card = await findFavPinned(cards, _id);

  const len = await cardSchema
    .find({ author: _id, isDeleted: false })
    .countDocuments();
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
cardRouter.get("/validation", async (req, res) => {
  try {
    const token = req.cookies.token;
    const decode = jwt.verify(token, process.env.SECRET);
    const userId = decode.checkUser._id;

    const totalCount = await Card.countDocuments({
      author: userId,
      isDeleted: false,
    });

    const duplicates = await Card.aggregate([
      {
        $match: {
          author: new mongoose.Types.ObjectId(userId),
          isDeleted: false,
        },
      },
      {
        $group: {
          _id: { content: "$content" },
          count: { $sum: 1 },
        },
      },
      {
        $match: { count: { $gt: 1 } },
      },
    ]);

    const dupGroups = duplicates.length;

    const duplicatesToDelete = duplicates.reduce((sum, group) => {
      return sum + (group.count - 1);
    }, 0);

    const uniqueRemaining = totalCount - duplicatesToDelete;

    return res.json({
      totalCount,
      duplicateGroups: dupGroups,
      duplicatesToDelete,
      uniqueRemaining,
    });
  } catch (error) {
    console.error("Validation route error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
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
          { isDeleted: false },
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

    const deletedCard = await cardSchema.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

    if (!deletedCard) {
      return res.status(404).json({ error: "Card not found" });
    }

    await createActivity({
      title: "Card Deleted",
      author: deletedCard.author,
      activity: "deleted",
      entityId: deletedCard._id,
      entityType: "snippet",
      status: "success",
    });

    return res.status(200).json({ message: "Card Deleted Successfully" });
  } catch (error) {
    console.error("Delete error:", error);

    try {
      await createActivity({
        title: "Card Delete Failed",
        author: req.user?._id || null,
        activity: "deleted",
        entityType: "snippet",
        status: "failure",
      });
    } catch (logErr) {
      console.error("Activity log failed:", logErr);
    }

    return res.status(500).json({ error: "An unexpected error occurred" });
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
  const card = await cardSchema.findOne({ _id: id, isDeleted: false });
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
  await createActivity({
    title: "Card Updated",
    author: editcard.author,
    activity: "updated",
    entityId: editcard._id,
    entityType: "snippet",
    status: "success",
  });
  res.json({ editcard });
});

cardRouter.put("/restore/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid Card ID" });
  }
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id, userName, userImage } = decode.checkUser;
  try {
    const card = await cardSchema.find({ _id });
    const editcard = await cardSchema.findByIdAndUpdate(
      id,
      { isDeleted: false },
      { new: true }
    );
    await createActivity({
      title: "Card Restored",
      author: editcard.author,
      activity: "restored",
      entityId: editcard._id,
      entityType: "snippet",
      status: "success",
    });
    res.json({ editcard });
  } catch (error) {
    try {
      await createActivity({
        title: "Card Restore Failed",
        author: req.user?._id || null,
        activity: "restored",
        entityType: "snippet",
        status: "failure",
      });
    } catch (logErr) {
      console.error("Activity log failed:", logErr);
    }
    return res.status(500).json({ error: "An unexpected error occurred" });
  }
});

cardRouter.put("/pin/:id", async (req, res) => {
  try {
    const cardId = req.params.id;
    const token = req.cookies.token;
    const decode = jwt.verify(token, process.env.SECRET);
    const userId = decode.checkUser._id;
    const checkCard = await cardSchema.findOne({
      _id: new mongoose.Types.ObjectId(cardId),
      isDeleted: true,
    });
    if (checkCard) {
      return res.status(404).json({ error: "Card not found" });
    }
    if (!mongoose.Types.ObjectId.isValid(cardId)) {
      return res.status(400).json({ error: "Invalid Card ID" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isPinned = user.pinnedCards.includes(cardId);

    if (isPinned) {
      user.pinnedCards.pull(cardId);
      await createActivity({
        title: "Card Unpinned",
        author: user._id,
        activity: "updated",
        entityId: cardId,
        entityType: "snippet",
        status: "success",
      });
    } else {
      user.pinnedCards.push(cardId);
      await createActivity({
        title: "Card Pinned",
        author: user._id,
        activity: "updated",
        entityId: cardId,
        entityType: "snippet",
        status: "success",
      });
    }

    await user.save();

    res.json({
      success: true,
      message: isPinned ? "unpinned" : "pinned",
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

    const checkCard = await cardSchema.findOne({
      _id: new mongoose.Types.ObjectId(cardId),
      isDeleted: true,
    });
    if (checkCard) {
      return res.status(404).json({ error: "Card not found" });
    }

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: "User not found" });

    const isFavorite = user.favoriteCards.includes(cardId);

    if (isFavorite) {
      user.favoriteCards.pull(cardId); // remove
      await cardSchema.findByIdAndUpdate(
        cardId,
        { $pull: { likes: user._id } },
        { new: true }
      );
      await createActivity({
        title: "Card Unfavorited",
        author: user._id,
        activity: "updated",
        entityId: cardId,
        entityType: "snippet",
        status: "success",
      });

    } else {
      user.favoriteCards.push(cardId); 
      await cardSchema.findByIdAndUpdate(
        cardId,
        { $push: { likes: user._id } },
        { new: true }
      );
      await createActivity({
        title: "Card Favorited",
        author: user._id,
        activity: "updated",
        entityId: cardId,
        entityType: "snippet",
        status: "success",
      });
    }

    await user.save();

    res.json({
      success: true,
      message: `${isFavorite ? "unfavorited" : "favorited"}`,
      favoriteCards: user.favoriteCards,
    });
  } catch (err) {
    console.error("Error favoriting card:", err.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

cardRouter.post("/delete", (req, res) => {
  const getData = req.body.selected;
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id } = decode.checkUser;
  try {
    cardSchema
      .updateMany(
        { author: _id, _id: { $in: getData } },
        { isDeleted: true },
        { new: true }
      )
      .then(() => {
        createActivity({
          title: "Card Deleted",
          author: req.body.author,
          activity: "deleted",
          entityId: getData,
          entityType: "snippet",
          status: "success",
        });
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
