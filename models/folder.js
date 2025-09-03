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
  path: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }],
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folder",
    default: null,
  },
  ispinned: {
    type: Boolean,
    default: false,
  },
 
}, {
  timestamps: true
});


module.exports = mongoose.model("Folder", folderSchema);
