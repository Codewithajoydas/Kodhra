const express = require("express");
const signup = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const multer = require("multer");
const cloudinary = require("../config/cloudinary.config");

signup.get("/", (req, res) => {
  res.render("signup");
});

const upload = multer({
  dest: "upload/",
});

signup.post("/", upload.single("userImage"), async (req, res) => {
  const {
    userName,
    email,
    password,
    userImage,
    country,
    address,
  } = req.body;
  if (!email) {
    return res
      .status(400)
      .json({ message: "Email and Mobile Number are required" });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).redirect("/login");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  let uploadedImage;
  if (userImage) {
    await cloudinary.uploader.upload(req.file.path, {
      folder: "my_images",
    });
  }

  await User.create({
    userName: email.split("@")[0],
    goodName: userName,
    email,
    password: hashPassword,
    userImage: uploadedImage?.secure_url,
    country,
    address,
  });
  res.redirect("/login");
});
module.exports = signup;
