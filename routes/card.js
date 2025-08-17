const express = require("express");
const cardRouter = express.Router();
const cardSchema = require("../models/Card");
const jwt = require("jsonwebtoken");

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

cardRouter.post("/", async (req, res) => {
  const { title, description, content, tags, category, author } = req.body;
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id, userName, email, userImage } = decode.checkUser;

  const createCard = await cardSchema.create({
    title,
    description,
    content,
    tags,
    category,
    author: _id,
  });
  res.json(createCard);
});

cardRouter.delete("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const dlecard = await cardSchema.findByIdAndDelete(id);
    res.json({ 200: "Card Deleted Successfully" });
  } catch (error) {
    res.json(error);
  }
});

cardRouter.get("/:id", async (req, res) => {
  const id = req.params.id;
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id, userName, userImage } = decode.checkUser;
  const card = await cardSchema.findOne({ _id: id });
  res.render("editCard", { card, image: userImage, userName });
});

cardRouter.put("/:id", async (req, res) => {
  const id = req.params.id;
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
  res.json({editcard});
});

module.exports = cardRouter;
