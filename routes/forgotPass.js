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
    await sendMail(email, "Password Reset Request", otp);
    await client.set(`otp:${email}`, otp, {
      EX: 200,
    });
    
    res.cookie("email", email).redirect("/forgotPass/verify");
  } catch (error) {
    res.json({ Error: "Someting Happend Wrong!" });
  }
});

fpRouter.post("/resend", async (req, res) => {
  const email = req.body.email;

  try {
    await client.del(`otp:${email}`);
    const otp = getOtp(6);
    await sendMail(email, "Password Reset Request", otp);
    await client.set(`otp:${email}`, otp, {
      EX: 200,
    });
    res.json({ message: "OTP sent successfully!" });
  } catch (error) {
    res.json({ message: `Someting Happend Wrong! ${error}` });
  }
});

fpRouter.post("/verifyOtp", async (req, res) => {
  const { otp } = req.body;
  if (!otp) return res.json({ error: "Please Enter OTP..." });
  const email = req.session.email;

  try {
    if (!email) {
      return res.json({
        error: "Session expired, please request OTP again!",
      });
    }
    const checkOtp = await client.get(`otp:${email}`);
    if (checkOtp === otp) {
      await client.del(`otp:${email}`);
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

fpRouter.get("/verify", async (req, res) => {
  res.render("verifyPass");
});

fpRouter.get("/otpexp", async (req, res) => {
  const email = req.session.email;
  if (!email) return res.json({ error: "Session expired" });

  const ttl = await client.ttl(`otp:${email}`);
  if (ttl === -2) return res.json({ error: "OTP expired or not found" });
  if (ttl === -1) return res.json({ ttl: 0 }); // no expiry

  res.json({ ttl }); // send seconds left
});


fpRouter.get("/reset", (req, res) => {
  const { email } = req.cookies;
  res.render("passwordReset");
});

fpRouter.post("/reset", async (req, res) => {
  try {
    const { newPassword } = req.body;
    const { email } = req.cookies;

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

    res.redirect("/login");
  } catch (err) {
    console.error("Password reset error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = fpRouter;
