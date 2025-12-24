const express = require("express");
const notebookRouter = express.Router();
const Notebook = require("../models/Notebook.js");
const jwt = require("jsonwebtoken");
const User = require("../models/User.js");
const { marked } = require("marked");
const createActivity = require("./activity.module.js");

notebookRouter.get("/", async (req, res) => {
  const token = await req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  try {
    const { _id, userName, email, userImage } = decode.checkUser;
    const notebooks = await Notebook.find({ author: _id, isDeleted: false }).sort({
      createdAt: -1, 
    });
    res.render("notebook", {
      notebooks,
      image: userImage,
      author: userName,
      userId: _id,
    });
  } catch (error) {
    res
      .status(500)
      .render("error", { error: "Server Error, Please try again" });
  }
});

notebookRouter.get("/get", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id, userName, email, userImage } = decode.checkUser;
  try {
    const notebooks = await Notebook.find({
      author: _id,
      isDeleted: false,
    }).populate("author");
    res.render("getnotebooks", {
      notebooks,
      image: userImage,
      author: userName,
      userId: _id,
    });
  } catch (error) {
    res.status(400).render("error", { error: "Server Error Please try again" });
  }
});

notebookRouter.post("/", async (req, res) => {
  const token = await req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  try {
    const { _id, userName, email, userImage } = decode.checkUser;
    const { notebookName, content } = req.body;
    const notebook = new Notebook({ author: _id, notebookName, content });
    await notebook.save();
    res
      .status(200)
      .json({ status: true, message: "Notebook created successfully" });
  } catch (error) {
    res.status(400).render("error", { error: "Server Error Please try again" });
  }
});

notebookRouter.get("/view/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id, userName, email, userImage } = decode.checkUser;

  const notebook = await Notebook.findById(id);
  if (!notebook) {
    return res
      .status(400)
      .render("error", { error: "Server Error Please try again" });
  }

  if (String(notebook.author) !== String(_id)) {
    return res
      .status(400)
      .render("error", { error: "Server Error Please try again" });
  }

  const html = marked(notebook.content);

  res.render("viewnotebook", {
    html,
    notebook,
    image: userImage,
    author: userName,
    userId: _id,
  });
});

notebookRouter.get("/:id", async (req, res) => {
  const { id } = req.params;
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id, userName, email, userImage } = decode.checkUser;

  const notebook = await Notebook.findById(id);
  if (!notebook) {
    return res
      .status(400)
      .render("error", { error: "Server Error Please try again" });
  }

  if (String(notebook.author) !== String(_id)) {
    return res
      .status(400)
      .render("error", { error: "Server Error Please try again" });
  }

  res.render("editNotebook", {
    notebook,
    image: userImage,
    author: userName,
    userId: _id,
  });
});

notebookRouter.post("/:id", async (req, res) => {
  const { id } = req.params;
  const { notebookName, content } = req.body;

  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id, userName, email, userImage } = decode.checkUser;

  const notebook = await Notebook.findById(id);
  if (!notebook) {
    return res
      .status(400)
      .render("error", { error: "Server Error Please try again" });
  }

  if (String(notebook.author) !== String(_id)) {
    return res
      .status(400)
      .render("error", { error: "Server Error Please try again" });
  }

  notebook.notebookName = notebookName;
  notebook.content = content;
  await notebook.save();

  await createActivity({
    title: "Notebook Updated",
    author: notebook.author,
    activity: "updated",
    entityId: notebook._id,
    entityType: "other",
    status: "success",
  });

  res
    .status(200)
    .json({ status: true, message: "Notebook updated successfully" });
});

module.exports = notebookRouter;
