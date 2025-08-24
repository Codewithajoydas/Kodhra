const mongoose = require("mongoose");
const folderSchema = new mongoose.Schema({
  folderName: {
    type: String,
    required: true,
    trim: true,
    default: "My Folder",
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  cards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
    },
  ],
  timestamps: {
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  }
});

module.exports = mongoose.model("Folder", folderSchema);
