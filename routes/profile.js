const express = require("express");
const profileRouter = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { default: mongoose } = require("mongoose");
const Card = require("../models/Card");
const getIO = require("./socket")
profileRouter.get("/:user", async (req, res) => {
  try {
    const token = req.cookies.token;
    const USER_NAME = req.params.user;
    const decode = jwt.verify(token, process.env.SECRET);
    const { _id, userName, email, userImage } = decode.checkUser;
    const user = await User.findOne({ userName: USER_NAME });
    const cardlen = await Card.find({ author: user._id }).countDocuments();
    if (!user) return res.json({ status: false, message: "User not found" });
    res.render("profile", {
      author: userName,
      image: userImage,
      userId: _id,
      user,
      cardlen
    });
  } catch (error) {
    res.render("error", {error:"Something went wrong. Check the user id and try again."});
  }
});
profileRouter.get("/", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id, userName, email, userImage } = decode.checkUser;
  const user = await User.findById(_id);
  const cardlen = await Card.find({ author: user._id }).countDocuments();

  res.render("profile", {
    author: userName,
    image: userImage,
    userId: _id,
    user,
    cardlen
  });
});

profileRouter.post("/follow/:id", async (req, res) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).json({ status: false, message: "Unauthorized" });

  const decode = jwt.verify(token, process.env.SECRET);
  const userId = decode.checkUser._id;
  const targetUser = req.params.id;

  if (targetUser === userId)
    return res
      .status(400)
      .json({ status: false, message: "You cannot follow yourself" });

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const target = await User.findById(targetUser).session(session);
    const user = await User.findById(userId).session(session);
    if (!target || !user) throw new Error("User not found");

    const isFollowing = target.followers.includes(userId);

    if (!isFollowing) {
      await User.updateOne(
        { _id: targetUser },
        { $push: { followers: userId } }
      ).session(session);
      await User.updateOne(
        { _id: userId },
        { $push: { following: targetUser } }
      ).session(session);
      await session.commitTransaction();
      const io = getIO();
      res.json({ status: true, message: "followed" });

    } else {
      await User.updateOne(
        { _id: targetUser },
        { $pull: { followers: userId } }
      ).session(session);
      await User.updateOne(
        { _id: userId },
        { $pull: { following: targetUser } }
      ).session(session);
      await session.commitTransaction();
      res.json({ status: true, message: "unfollowed" });
    }
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ status: false, message: error.message });
  } finally {
    session.endSession();
  }
});

module.exports = profileRouter;
