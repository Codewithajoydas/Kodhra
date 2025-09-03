const express = require("express");
const sRouter = express.Router();
const jwt = require("jsonwebtoken");
require("dotenv").config();

sRouter.get("/", (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
    res.render("settings", {
      image: decode.checkUser.userImage
  });
});

module.exports = sRouter;
