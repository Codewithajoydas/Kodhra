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
    mobileNumber,
  } = req.body;
  if (!email || !mobileNumber) {
    return res
      .status(400)
      .json({ message: "Email and Mobile Number are required" });
  }
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).redirect("/login");
  }
  const hashPassword = await bcrypt.hash(password, 10);
  const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
    folder: "my_images",
  });
  console.log(uploadedImage);
  const createUser = await User.create({
    userName,
    email,
    password: hashPassword,
    userImage: uploadedImage.secure_url,
    country,
    address,
    mobileNumber,
  });
  res.redirect("/login");
});
module.exports = signup;
