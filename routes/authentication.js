const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendMail = require("../utils/sendmail.module.js");
const { getIO } = require("./socket");
const sendNotification = require("../utils/sendNotification.module");
router.get("/", (req, res) => {
  res.render("login");
});

router.post("/", async (req, res) => {
  const { email, password } = req.body;

  try {
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(404).json({ message: "User Not Found" });
    }

    const comparePass = await bcrypt.compare(password, checkUser.password);
    if (!comparePass) {
      return res.status(401).json({ message: "Password Not Match" });
    }

    const token = jwt.sign({ checkUser }, process.env.SECRET);

    // Set cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    sendNotification(
      "Login Success",
      "You have successfully logged in, now you can create snippets and folders ",
      "/card/create",
      checkUser._id
    );
    res.redirect("/");
  } catch (error) {
    console.error("Something went wrong", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});
router.get("/check", (req, res) => {
  res.json({ cookies: req.cookies });
});

module.exports = router;
