const express = require("express");
const router = express.Router();
const User = require("../models/User");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  try {
    const token = req.cookies.token;
    const decode = jwt.verify(token, process.env.SECRET);
    const { _id } = decode.checkUser;

    const users = await User.aggregate([
      {
        $match: {
          _id: { $ne: _id },
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
          followers: 0,
        },
      },
    ]);

    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
