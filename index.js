/**
 * Express framework module.
 * @module express
 * @requires express
 * @type {import('express')}
 */
const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const router = require("./routes/authentication");
const signup = require("./routes/authoraization");
const gitroute = require("./routes/githubOauth");
const cardRouter = require("./routes/card");
const session = require("express-session");
const fpRouter = require("./routes/forgotPass.js");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const RedisStore = require("connect-redis").RedisStore;
const client = require("./config/redis.config.js");
const path = require("path");
const cors = require("cors");
const Folder = require("./models/folder");

app.use(
  cors({
    origin: "http://127.0.0.1:5000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.set("view engine", "ejs");
const User = require("./models/User");
const connectDB = require("./config/mongoose.config");
connectDB();
const authMiddleware = require("./middleware/auth.middleware");
const vRouter = require("./routes/verifyEmail");
const Card = require("./models/Card");
const shareLink = require("./utils/shareLink.module");
const folderRouter = require("./routes/folder");
const searchRouter = require("./routes/search");
const tagsRouter = require("./routes/tags");
const pinRouter = require('./routes/pin');
app.get("/favicon.ico", (req, res) => res.status(204).end());
app.use(express.json());

app.use(
  session({
    store: new RedisStore({ client }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 5 * 60 * 1000 },
  })
);

app.use(express.urlencoded({ extended: true }));

// HOME ROUTER
app.get("/", authMiddleware, async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const userEmail = decode.checkUser.email;
  const folders = await Folder.find({ author: decode.checkUser._id });
  const cards = await Card.find({ author: decode.checkUser._id })
    .sort({ createdAt: -1 })
    .limit(5);

  res.render("index", {
    image: decode.checkUser?.userImage || decode.user?.avatar,
    cards,
    author: decode.checkUser.userName,
    userId: decode.checkUser._id,
    folders,
  });
});

app.post("/card", async (req, res) => {
  const { title, description, content, tags, category, folderName } = req.body;

  try {
    const token = req.cookies.token;
    const decode = jwt.verify(token, process.env.SECRET);
    const { _id } = decode.checkUser;

    if (!_id) return res.status(401).json({ error: "Unauthorized" });

    const createCard = await Card.create({
      title,
      description,
      content,
      tags,
      category,
      author: _id,
    });

    const folderNames = Array.isArray(folderName) ? folderName : [folderName];

    for (const name of folderNames) {
      let folder = await Folder.findOne({ folderName: name, author: _id });
      if (!folder) {
        folder = await Folder.create({
          folderName: name,
          cards: [createCard._id],
          author: _id,
        });
      } else {
        folder.cards.push(createCard._id);
        await folder.save();
      }
    }

    res.json({ createCard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.use("/login", router);
app.use("/signup", signup);
app.use("/card", authMiddleware, cardRouter);
app.use("/dlt", authMiddleware, cardRouter);
app.use("/edit", authMiddleware, cardRouter);
app.use("/forgotPass", fpRouter);
app.use("/auth/github/", gitroute);
app.use("/emailverification", vRouter);
app.use("/folder", authMiddleware, folderRouter);
app.use("/search", authMiddleware, searchRouter);
app.use("/tags", authMiddleware, tagsRouter);
app.use("/pin", authMiddleware, pinRouter);

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ error: "Server error", details: err.message });
});


app.use((req, res, next) => {
  res.status(404).render("pageNotFound");
});
app.listen(process.env.PORT, () => {
  console.log("Server running on http://localhost:5000");
});
