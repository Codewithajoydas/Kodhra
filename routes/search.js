const express = require("express");
const searchRouter = express.Router();
const Card = require("../models/Card");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");
const findFavPin = require("../utils/findFavPin.module");
searchRouter.get("/", async (req, res) => {
  const tokens = req.cookies.token;
  const decode = jwt.verify(tokens, process.env.SECRET);
  const { userName, userImage, id } = decode.checkUser;
  res.render("search", { author: userName, image: userImage, userId: id });
});

searchRouter.get("/universal", async (req, res) => {
  const { title, des, content, author, category } = req.query;
  const tokens = req.cookies.token;
  const decode = jwt.verify(tokens, process.env.SECRET);
  const { _id, userImage, userName } = decode.checkUser;
  try {
    const cards = await Card.find({
      $or: [
        { title: { $regex: title, $options: "i" } },
        { description: { $regex: des, $options: "i" } },
        { content: { $regex: content, $options: "i" } },
      ],
    }).populate("author");
    const card = await findFavPin(cards, _id);
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
  const { title, des, content, author } = req.query;
  try {
    const tokens = req.cookies.token;
    const decode = jwt.verify(tokens, process.env.SECRET);
    const { _id, userImage, userName } = decode.checkUser;
    const cards = await Card.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        {
          description: { $regex: q, $options: "i" },
        },
        {
          content: { $regex: q, $options: "i" },
        },
        {
          author:{ $regex: q, $options: "i" },
        }
      ],
    }).populate("author");
    const card = await findFavPin(cards, _id);
    res.json(cards);
  } catch (error) {
    res.json({ "Internal Server Error": error.message });
  }
});

module.exports = searchRouter;
