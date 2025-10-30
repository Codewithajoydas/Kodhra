const express = require("express");
const profileRouter = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
profileRouter.get("/:user", async (req, res) => {
  const token = req.cookies.token;
  const USER_NAME = req.params.user;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id, userName, email, userImage } = decode.checkUser;
  const user = await User.findOne({ userName: USER_NAME });
  res.render("profile", {
    author: userName,
    image: userImage,
    userId: _id,
    user,
  });
});
profileRouter.get("/", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id, userName, email, userImage } = decode.checkUser;
  res.render("profile", {
    author: userName,
    image: userImage,
    userId: _id,
    user: decode.checkUser,
  });
});

profileRouter.post("/follow/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.token;
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decode = jwt.verify(token, process.env.SECRET);
    const userId = decode.checkUser._id;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });
    const isFollowing = user.followers.includes(userId);
    let updatedUser;
    if (isFollowing) {
      updatedUser = await User.findByIdAndUpdate(
        id,
        { $pull: { followers: userId } },
        { new: true }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        id,
        { $push: { followers: userId } },
        { new: true }
      );
    }
    res.json({ data: updatedUser });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});


module.exports = profileRouter;
