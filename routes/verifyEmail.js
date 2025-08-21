const express = require("express");
const vRouter = express.Router();
const getOtp = require("../utils/generateOtp.module.js");
const sendMail = require("../utils/sendmail.module.js");
const client = require("../config/redis.config.js");
const User = require("../models/User.js");
const bcrypt = require("bcryptjs");

vRouter.post("/", async (req, res) => {
  const email = req.body.email;
  try {
    const otp = getOtp(6);
    req.session.email = email;
    await sendMail(email, "Verify Email ID", otp);
    await client.set(`otp:${email}`, otp, {
      EX: 200,
    });
    res.redirect("emailverification/verify");
  } catch (error) {
    res.json({ Error: "Something Happend Wrong!" });
  }
});

vRouter.post("/verifyOtp", async (req, res) => {
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
      await client.del(`otp:${email}`);

      await User.findOneAndUpdate(
        { email },
        { emailVerified: true },
        { new: true }
      );
      res.redirect("/");
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

vRouter.get("/", (req, res) => {
  res.render("emailVerification");
});
vRouter.get("/verify", (req, res) => {
  res.render("verifyPass");
});
module.exports = vRouter;
