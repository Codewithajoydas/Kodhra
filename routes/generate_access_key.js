const express = require("express");
const accesskeyRouter = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
accesskeyRouter.post("/accesskey", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id } = decode.checkUser;
  try {
    const checkUser = await User.findOne({ _id });
    if (!checkUser) {
      return res.status(404).render("error", {
        error: "User Not Found Kindly Provide Correct Email And Try Again",
      });
    }
    const accesskey = crypto.randomBytes(64).toString("hex");
    checkUser.accesskey = await bcrypt.hash(accesskey, 10);
    await checkUser.save();
    res.json({ accesskey_token: checkUser.accesskey });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error, Please try again" });
  }
});

module.exports = accesskeyRouter;
