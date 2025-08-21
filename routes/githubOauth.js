const express = require("express");
const gitroute = express.Router();
const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const axios = require("axios");
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();
gitroute.get("/", (req, res) => {
  const redirect_uri = "http://localhost:5000/auth/github/callback";
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect_uri}&scope=user:email`
  );
});

gitroute.get("/callback", async (req, res) => {
  const code = req.query.code; 

  try {
    const tokenResponse = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      { headers: { Accept: "application/json" } }
    );

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `token ${accessToken}` },
    });

    const emailResponse = await axios.get(
      "https://api.github.com/user/emails",
      {
        headers: { Authorization: `token ${accessToken}` },
      }
    );

    const primaryEmail =
      emailResponse.data.find((e) => e.primary && e.verified)?.email || null;

    const user = {
      id: userResponse.data.id,
      name: userResponse.data.name,
      login: userResponse.data.login,
      avatar: userResponse.data.avatar_url,
      email: primaryEmail,
    };

    const myToken = jwt.sign({ user }, process.env.SECRET, {
      expiresIn: "1d",
    });

    res.cookie("token", myToken, {
      httpOnly: true,
      secure: false, 
      sameSite: "lax", 
      maxAge: 24 * 60 * 60 * 1000, 
    });

    res.json({ user });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ error: "GitHub login failed" });
  }
});

module.exports = gitroute;
