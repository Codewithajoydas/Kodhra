const express = require("express");
const generateImages = require("../utils/generateImages.module");
const imageRouter = express.Router();

imageRouter.get("/", async (req, res) => {
  const {q, page} = req.query;
  let images = await generateImages(q, page);
  res.json({ images: images });
});

module.exports = imageRouter;
