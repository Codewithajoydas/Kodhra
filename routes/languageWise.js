const express = require("express");
const languageRouter = express.Router();
const CardDB = require("../models/Card");
const jwt = require("jsonwebtoken");
const { default: mongoose } = require("mongoose");
languageRouter.get("/", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id, userImage } = decode.checkUser;
  try {
    const cards = await CardDB.aggregate([
      { $match: { author: new mongoose.Types.ObjectId(_id) } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]);
    res.render("language", {
      cards,
      image: userImage,
    });
  } catch (error) {
    res.render("error", { error: "Something went wrong... Please try again!" });
    console.log(error);
  }
});

module.exports = languageRouter;
