const express = require("express");
const expoloreRouter = express.Router();
const Card = require("../models/Card");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");
const findFavPin = require("../utils/findFavPin.module");
const findFavPinned = require("../utils/findFavPin.module");
const { default: mongoose } = require("mongoose");

expoloreRouter.get("/", async (req, res) => {
  const { pageNum } = req.query;
  const limit = 10;
  const skip = (pageNum - 1) * limit;

  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { userName, userImage, _id } = decode.checkUser;
  const following = (await User.findById(_id)).following;
  const cards = await Card.aggregate([
    // 1. Only public & active cards
    {
      $match: {
        author: { $ne: new mongoose.Types.ObjectId(_id) },
        visibility: true,
        isDeleted: false,
      },
    },

    // 2. Count likes
    {
      $addFields: {
        likesCount: {
          $size: { $ifNull: ["$likes", []] },
        },
        ageInDays: {
          $divide: [{ $subtract: [new Date(), "$createdAt"] }, 86400000],
        },
      },
    },

    // 3. Popularity score
    {
      $addFields: {
        popularityScore: {
          $add: [
            { $multiply: ["$likesCount", 5] },
            {
              $cond: [{ $lt: ["$ageInDays", 7] }, 10, 0],
            },
          ],
        },
      },
    },

    // 4. Sort by score
    {
      $sort: { popularityScore: -1 },
    },

    {
      $lookup: {
        from: "users",
        localField: "author",
        foreignField: "_id",
        as: "author",
      },
    },
    { $unwind: "$author" },
    // 5. Limit
    {
      $limit: 10,
    },
  ]);
  const card = await findFavPinned(cards, _id);

  const users = await User.aggregate([
    {
      $match: {
        _id: {
          $ne: new mongoose.Types.ObjectId(_id), 
          $nin: following
         },

      },
    },

    {
      $lookup: {
        from: "cards",
        localField: "_id",
        foreignField: "author",
        as: "cards",
      },
    },

    {
      $addFields: {
        followersCount: {
          $size: { $ifNull: ["$followers", []] },
        },
        totalLikes: {
          $size: { $ifNull: ["$cards.likes", []] },
        },
      },
    },

    {
      $addFields: {
        score: {
          $add: [
            { $multiply: ["$followersCount", 4] },
            { $multiply: ["$totalLikes", 1] },
          ],
        },
      },
    },

    {
      $sort: { score: -1 },
    },

    {
      $limit: 10,
    },

    {
      $project: {
        cards: 0,
      },
    },
  ]);
  console.log(users);
  res.render("explore", {
    card,
    image: userImage,
    author: userName,
    userId: _id,
    users,
  });
});

module.exports = expoloreRouter;
