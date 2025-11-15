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
  const { query, user_Name, Language, pageNum } = req.query;
  const tokens = req.cookies.token;
  const decode = jwt.verify(tokens, process.env.SECRET);
  const { _id, userImage, userName } = decode.checkUser;
  try {
    const cards = await Card.find({
      $or: [
        { title: { $regex: query, $options: "i" } },
        { description: { $regex: query, $options: "i" } },
        { content: { $regex: query, $options: "i" } },
      ],
    }).populate("author");
    console.log(cards);
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
  const { q, pageNum } = req.query;
  try {
    const tokens = req.cookies.token;
    const decode = jwt.verify(tokens, process.env.SECRET);
    const { _id, userImage, userName } = decode.checkUser;
    const page = parseInt(pageNum) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const cards = await Card.find({
      $or: [
        { title: { $regex: q, $options: "i" } },
        {
          description: { $regex: q, $options: "i" },
        },
        {
          content: { $regex: q, $options: "i" },
        },
      ],
    })
      .skip(skip)
      .limit(limit);
    const card = await findFavPin(cards, _id);
    res.json(cards);
  } catch (error) {
    res.json({ "Internal Server Error": error.message });
  }
});

module.exports = searchRouter;
