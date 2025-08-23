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
const Folder = require("./models/folder");
const shareLink = require("./utils/shareLink.module");
const folderRouter = require("./routes/folder");
const searchRouter = require('./routes/search');
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
  const cards = await Card.find({ author: decode.checkUser._id })
    .sort({ createdAt: -1 })
    .limit(5);

  res.render("index", {
    image: decode.checkUser?.userImage || decode.user?.avatar,
    cards,
    author: decode.checkUser.userName,
    userId: decode.checkUser._id,
  });
});

app.post("/card", async (req, res) => {
  const { title, description, content, tags, category, folderName } = req.body;
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id } = decode.checkUser;

  const createCard = await Card.create({
    // 👈 use Card, not cardSchema
    title,
    description,
    content,
    tags,
    category,
    author: _id,
  });

  let folder = await Folder.findOne({ folderName });

  if (!folder) {
    folder = await Folder.create({
      folderName,
      cards: [createCard._id],
    });
  } else {
    folder.cards.push(createCard._id);
    await folder.save();
  }

  res.json({ createCard });
});


app.use("/login", router);
app.use("/signup", signup);
app.use("/card", authMiddleware, cardRouter);
app.use("/dlt", authMiddleware, cardRouter);
app.use("/edit", authMiddleware, cardRouter);
app.use("/forgotPass", fpRouter);
app.use("/auth/github/", gitroute);
app.use("/emailverification", vRouter);
app.use("/folder", folderRouter);
app.use("/search", searchRouter);

app.use((req, res, next) => {
  res.status(404).render("pageNotFound");
});
app.listen(process.env.PORT, () => {
  console.log("Server running on http://localhost:5000");
});
