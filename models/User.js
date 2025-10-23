const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
    },
    goodName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    userImage: {
      type: String,
      default: "",
    },
    country: {
      type: String,
    },
    address: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "suspended"],
      default: "active",
    },
    provider: {
      type: String,
      enum: ["local", "google", "github"],
      default: "local",
    },
    providerId: {
      type: String,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    follwers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    savedCards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
    draftCards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
    pinnedCards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
    favoriteCards: [{ type: mongoose.Schema.Types.ObjectId, ref: "Card" }],
  },
  { timestamps: true }
);




module.exports = mongoose.model("User", UserSchema);
