const express = require("express");
const profileRouter = express.Router();
const jwt  = require("jsonwebtoken");
profileRouter.get("/", (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id, userName, email, userImage } = decode.checkUser;
  res.render("profile", { author: userName, image: userImage, userId: _id, user:decode.checkUser });
});

module.exports = profileRouter;
