const express = require("express");
const expoloreRouter = express.Router();
const Card = require("../models/Card");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");
const findFavPin = require("../utils/findFavPin.module");

expoloreRouter.get("/", async (req, res) => {
  const { pageNum } = req.query;
  const limit = 10;
  const skip = (pageNum - 1) * limit;

  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { userName, userImage, _id } = decode.checkUser;
  const following = (await User.findById(_id)).following;
  const card = await Card.find({ author: { $in: following } }).populate("author", "userName userImage").sort({
    createdAt: -1,
  });
  res.render("explore", {
    card,
    image: userImage,
    author: userName,
    userId: _id,
  });
});

module.exports = expoloreRouter;
