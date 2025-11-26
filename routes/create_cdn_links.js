const express = require("express");
const cdnRouter = express.Router();
const jwt = require("jsonwebtoken");
const CDN_LINK = require("../models/cdnlinks");
const mongoose = require("mongoose");
const Card = require("../models/Card");

// Make sure cookie-parser is used in your app:
// const cookieParser = require('cookie-parser');
// app.use(cookieParser());

cdnRouter.post("/:id", async (req, res) => {
  const token = req.cookies && req.cookies.token;
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: token missing" });
  }

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.SECRET);
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: invalid token" });
  }

  const userId = decoded?.checkUser?._id;
  if (!userId) {
    return res
      .status(401)
      .json({ error: "Unauthorized: user not found in token" });
  }

  const cardId = req.params.id;
  if (!cardId) {
    return res.status(400).json({ error: "Card ID is required" });
  }

  if (!mongoose.Types.ObjectId.isValid(cardId)) {
    return res.status(400).json({ error: "Invalid Card ID" });
  }

  try {
    const checkCard = await Card.findById(cardId).lean();
    if (!checkCard) {
      return res.status(404).json({ error: "Card not found" });
    }

    // Optional: ensure ownership if needed:
    // if (String(checkCard.author) !== String(userId)) {
    //   return res.status(403).json({ error: "Forbidden: you don't own this card" });
    // }

    // Ensure we have content to publish
    if (!checkCard.content) {
      return res
        .status(400)
        .json({ error: "Card has no content to create CDN link" });
    }

    const generate_cdn_link = await CDN_LINK.create({
      author: userId,
      code: checkCard.content,
      cardId: cardId,
      createdAt: new Date(),
    });

    // Consider returning a shorter URL or slug instead of full DB doc
    return res.status(201).json({link:generate_cdn_link});
  } catch (error) {
    console.error("CDN route error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

cdnRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const cdnLink = await CDN_LINK.findById(id);
    if (!cdnLink) {
      return res.status(404).json({ error: "CDN link not found" });
    }
    return res.status(200).send(cdnLink.code);
  } catch (error) {
    console.error("CDN route error:", error);
    return res.status(500).json({ error: "Server error" });
  }
});

module.exports = cdnRouter;
