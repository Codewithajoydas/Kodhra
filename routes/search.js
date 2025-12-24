const express = require("express");
const searchRouter = express.Router();
const Card = require("../models/Card");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");
const findFavPin = require("../utils/findFavPin.module");
const searchAlgoritm = require("../utils/searchAlgoritm.module");
const folder = require("../models/folder");
searchRouter.get("/", async (req, res) => {
  const tokens = req.cookies.token;
  const decode = jwt.verify(tokens, process.env.SECRET);
  const { userName, userImage, _id } = decode.checkUser;
  res.render("search", { author: userName, image: userImage, userId: _id });
});

searchRouter.get("/universal", async (req, res) => {
  const { query, user_Name, language, pageNum } = req.query;
  console.log(pageNum);
  const tokens = req.cookies.token;
  const decode = jwt.verify(tokens, process.env.SECRET);
  const { _id, userImage, userName } = decode.checkUser;
  try {
    const cardss = await searchAlgoritm(
      query,
      user_Name,
      language,
      pageNum
    ).then((result) => {
      return {
        cards: result.cards,
        notebooks: result.notebooks,
        folders: result.folders,
        users: result.users,
      };
    });
    // console.log(
    //   "Nootbooks:- ",
    //   cardss.notebooks,
    //   "\n Folders:- ",
    //   cardss.folders,
    //   "\n Users:- ",
    //   cardss.users
    // );
    const card = await findFavPin(cardss.cards, _id);
    if (card.length < 10) {
      console.log("No More Cards Available...!");
    }
    res.json({
      cards: card,
      notebooks: cardss.notebooks,
      folders: cardss.folders,
      users: cardss.users,
    });
  } catch (error) {
    res.json({ "Internal Server Error": error.message });
  }
});
searchRouter.get("/json", async (req, res) => {
  const { query, user_Name, language, pageNum } = req.query;
  const tokens = req.cookies.token;
  const decode = jwt.verify(tokens, process.env.SECRET);
  const { _id, userImage, userName } = decode.checkUser;
  try {
    const cardss = await searchAlgoritm(
      query,
      user_Name,
      language,
      pageNum
    ).then((result) => {
      return {
        cards: result.cards,
        notebooks: result.notebooks,
        folders: result.folders,
        users: result.users,
      };
    });
    console.log(
      "Nootbooks:- ",
      cardss.notebooks,
      "\n Folders:- ",
      cardss.folders,
      "\n Users:- ",
      cardss.users
    );
     res.json({
       card: cardss.cards,
       folder: cardss.folders,
       notebook: cardss.notebooks,
    });
  } catch (error) {
    res.json({ "Internal Server Error": error.message });
  }
});

module.exports = searchRouter;
