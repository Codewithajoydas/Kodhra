const express = require("express");
const searchRouter = express.Router();
const Card = require("../models/Card");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const findFavPin = require("../utils/findFavPin.module");
searchRouter.get("/", async (req, res) => {
  const tokens = req.cookies.token;
  const decode = jwt.verify(tokens, process.env.SECRET);
  const { userName, userImage, id } = decode.checkUser;
  res.render("search", { author: userName, image: userImage, userId: id });
});


searchRouter.get("/universal", async (req, res) => {
  const { q } = req.query;
  const tokens = req.cookies.token;
  const decode = jwt.verify(tokens, process.env.SECRET);
  const { _id, userImage, userName } = decode.checkUser;
  try {
    const cards = await Card.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ],
    }).populate("author", "_id userName userImage");
    const card = await findFavPin(cards, _id);
    console.error(card)
    res.render("partials/cards", {
      card,
      author: userName,
      image: userImage,
      userId: _id,
    });
  } catch (error) {
    res.json({ "Internal Server Error": error.message });
  }
});

searchRouter.get("/json", async (req, res) => {
  const { q } = req.query;
  const tokens = req.cookies.token;
  const decode = jwt.verify(tokens, process.env.SECRET);
  const { _id, userImage, userName } = decode.checkUser;
  try {
    const cards = await Card.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
        { tags: { $regex: q, $options: "i" } },
      ],
    }).populate("author");
    const card = await findFavPin(cards, _id);
    res.json(card);
  } catch (error) {
    res.json({ "Internal Server Error": error.message });
  }
});

module.exports = searchRouter;
