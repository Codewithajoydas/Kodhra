const express = require("express");
const fpRouter = express.Router();
const getOtp = require("../utils/generateOtp.module.js");
const sendMail = require("../utils/sendmail.module.js");
const client = require("../config/redis.config.js");
const User = require("../models/User.js");
const bcrypt = require("bcryptjs");

fpRouter.get("/", (req, res) => {
  res.render("fppage");
});
fpRouter.post("/", async (req, res) => {
  const email = req.body.email;
  try {
    const otp = getOtp(6);
    req.session.email = email;
    await sendMail(email, "Password Reset Request", otp);
    await client.set(`otp:${email}`, otp, {
      EX: 200,
    });
    res.redirect("forgotPass/verify");
  } catch (error) {
    res.json({ Error: "Someting Happend Wrong!" });
  }
});

fpRouter.post("/verifyOtp", async (req, res) => {
  const { otp } = req.body;
  if (!otp) return res.json({ error: "Please Enter OTP..." });
  const email = req.session.email;
  console.log(email);
  try {
    if (!email) {
      return res.json({
        error: "Session expired, please request OTP again!",
      });
    }
    const checkOtp = await client.get(`otp:${email}`);
    if (checkOtp === otp) {
      await client.del(`otp:${email}`)
      res.redirect("/forgotPass/reset");
    } else {
      res.json({
        error: "Invalid or expired OTP!",
      });
    }
  } catch (error) {
    res.json({
      error: "Something happend wrong...",
      email,
    });
  }
});

fpRouter.get("/verify", (req, res) => {
  res.render("verifyPass");
});

fpRouter.get("/reset", (req, res) => {
  const { email } = req.session;
  res.render("passwordReset");
});

fpRouter.post("/reset", async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { email } = req.session;

    if (!email) {
      return res.status(401).json({ error: "Session Expired. Try Again!" });
    }

    
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true } 
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ success: true, user: updatedUser });
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = fpRouter;
