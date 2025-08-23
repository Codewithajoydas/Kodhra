const mongoose = require("mongoose");
const folderSchema = new mongoose.Schema({
  folderName: {
    type: String,
    required: true,
    trim: true,
    default: "My Folder",
  },
  cards: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Card",
    },
  ],
});
module.exports = mongoose.model("Folder", folderSchema);
