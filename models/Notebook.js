const mongoose = require("mongoose");

const notebookSchema = new mongoose.Schema(
  {
    notebookName: {
      type: String,
      required: true,
      trim: true,
      default: "My Notebook",
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: String,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Notebook", notebookSchema);
