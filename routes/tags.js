const express = require("express");
const tagsRouter = express.Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Card = require("../models/Card");

tagsRouter.get("/", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);

  const userId = decode.checkUser._id;
  const image = decode.checkUser.userImage;
  const userName = decode.checkUser.userName;

  try {
    const tags = await Card.aggregate([
      {
        $match: { author: new mongoose.Types.ObjectId(userId) }, 
      },
      { $unwind: "$tags" }, 
      {
        $group: {
          _id: "$tags",
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } }, 
    ]);

    res.render("tags", { tags, image, userName });
    console.log(tags)
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = tagsRouter;
