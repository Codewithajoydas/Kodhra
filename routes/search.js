const express = require("express");
const searchRouter = express.Router();
const Card = require("../models/Card");
const jwt = require("jsonwebtoken");
require("dotenv").config();
searchRouter.get("/", async (req, res) => {
  const tokens = req.cookies.token;
  const decode = jwt.verify(tokens, process.env.SECRET);
  const { _id } = decode.checkUser;
  const cards = await Card.find({ author: _id });
  const userIds = cards.map((card) => card.author);
  const { query } = req.query;
  const findCards = await Card.find({
    $and: [
      { author: { $in: userIds } },
      {
        $or: [
          { title: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { content: { $regex: query, $options: "i" } },
          { tags: { $regex: query, $options: "i" } },
          { category: { $regex: query, $options: "i" } },
        ],
      },
    ],
  });

    if(findCards.length === 0) {
      return res.status(200).json({ message: "No cards found" });
  }
  res.json({ findCards });
});

module.exports = searchRouter;
