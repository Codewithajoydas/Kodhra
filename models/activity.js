const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      default: "My Activity",
    },

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    activity: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "created",
        "updated",
        "deleted",
        "viewed",
        "downloaded",
        "shared",
        "renamed",
        "moved",
        "logged_in",
        "logged_out",
        "imported",
        "exported",
        "restored",
      ],
    },

    entityType: {
      type: String,
      trim: true,
      enum: [
        "snippet",
        "folder",
        "tag",
        "user",
        "file",
        "setting",
        "system",
        "other",
      ],
      default: "snippet",
    },

    entityId: {
      type: mongoose.Schema.Types.ObjectId,
    },


    createdAt: {
      type: Date,
      default: Date.now,
    },

    durationMs: {
      type: Number,
      default: 0,
    },


    status: {
      type: String,
      enum: ["success", "failed", "pending"],
      default: "success",
    },
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model("Activity", ActivitySchema);
