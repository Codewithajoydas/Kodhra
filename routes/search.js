const express = require("express");
const searchRouter = express.Router();
const Card = require("../models/Card");
const jwt = require("jsonwebtoken");
require("dotenv").config();

searchRouter.get("/", async (req, res) => {
  const tokens = req.cookies.token;
  let decode;

  try {
    decode = jwt.verify(tokens, process.env.SECRET);
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }

  const { _id } = decode.checkUser;
  let { query, title, code, description, language, folder, date } = req.query;

  const searchConditions = [];

  if (query) {
    searchConditions.push(
      { title: { $regex: query, $options: "i" } },
      { description: { $regex: query, $options: "i" } },
      { content: { $regex: query, $options: "i" } },
      { tags: { $regex: query, $options: "i" } },
      { category: { $regex: query, $options: "i" } }
    );
  }

  if (title) {
    searchConditions.push({ title: { $regex: title, $options: "i" } });
  }

  if (code) {
    searchConditions.push({ content: { $regex: code, $options: "i" } });
  }
  if (description) {
    searchConditions.push({
      description: { $regex: description, $options: "i" },
    });
  }
  if (language) {
    searchConditions.push({ category: { $regex: language, $options: "i" } });
  }
  if (folder) {
    searchConditions.push({ folder: { $regex: folder, $options: "i" } });
  }

  if (date) {
    const start = new Date(date);
    const end = new Date(date);
    end.setDate(end.getDate() + 1);
    searchConditions.push({ createdAt: { $gte: start, $lt: end } });
  }

  const findCards = await Card.find({
    author: _id,
    $or: searchConditions,
  });

  if (findCards.length === 0) {
    return res.status(200).json({ message: "No cards found" });
  }

  res.json({ findCards });
});

module.exports = searchRouter;
