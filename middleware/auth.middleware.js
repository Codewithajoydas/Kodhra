const jwt = require("jsonwebtoken");
const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
const authMiddleware = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    return res.redirect("/login");
  }
  try {
    const secret = process.env.SECRET;
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token." });
  }
};
module.exports = authMiddleware;
