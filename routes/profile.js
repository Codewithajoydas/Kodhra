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
  console.log(user);
  res.render("profile", {
    author: userName,
    image: userImage,
    userId: _id,
    user
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
    user:decode.checkUser
  });
});

module.exports = profileRouter;
