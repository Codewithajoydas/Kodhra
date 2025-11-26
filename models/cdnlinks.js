const mongoose = require("mongoose");

const CDN_LINK_SCHEMA = new mongoose.Schema({
  author: {
    type: new mongoose.Schema.Types.ObjectId(),
    ref: "User",
    required: true,
  },
  card: {
    type: new mongoose.Schema.Types.ObjectId(),
    ref: "Card",
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model("CDN_LINK", CDN_LINK_SCHEMA);