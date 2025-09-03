// const express = require("express");
// const moveRouter = express.Router();
// const jwt = require("jsonwebtoken");
// const Folder = require("../models/folder");
// const Card = require("../models/Card");
// require("dotenv").config();

// moveRouter.put("/cardId/:cardId/folderId/:folderId", async (req, res) => {
//   const { cardId, folderId } = req.params;
//   const token = req.cookies.token;
//   const decode = jwt.verify(token, process.env.SECRET);
//     const userId = decode.checkUser._id;
//     const findFolder = await Folder.findOne({ author: userId, _id: folderId });
//     if (!findFolder) {
//       return res.status(404).json({ error: "Folder not found" });
//     }
//     const findCard = await Card.findOne({ _id: cardId });
//     if (!findCard) {
//       return res.status(404).json({ error: "Card not found" });
//     }
//     findFolder.cards.push(cardId);
//     await findFolder.save();
//     res.json({ message: "Card moved to folder successfully" });
// });


// module.exports = moveRouter;