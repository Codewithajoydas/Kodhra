/**
 * Express framework module.
 * @module express
 * @requires express
 * @type {import('express')}
 */
const express = require("express");
const app = express();

const dotenv = require("dotenv");
const { default: mongoose } = require("mongoose");
dotenv.config();
const fs = require("fs");
const paymentRouter = require("./routes/payments");
const router = require("./routes/authentication");
const profileRouter = require("./routes/profile");
const signup = require("./routes/authoraization");
const googleAuthrouter = require("./routes/googleAuth");
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
app.use(express.json({ limit: "50mb" }));

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
const pinRouter = require("./routes/pin");
const ioRouter = require("./routes/import_export");
const favRouter = require("./routes/fav");
const sRouter = require("./routes/setting");
const moveRouter = require("./routes/move");
const deleteRouter = require("./routes/delete");
const imageRouter = require("./routes/getimage");
const os = require("os");
const http = require("http");
const server = http.createServer(app);
const socket = require("./routes/socket");
const notificationRouter = require("./routes/notification");
const sendNotification = require("./utils/sendNotification.module");
const shareRouter = require("./routes/share");
const languageRouter = require("./routes/languageWise");
const expoloreRouter = require("./routes/explore");
const activityRouter = require("./routes/activity");
const createActivity = require("./routes/activity.module");
const recyclebinRouter = require("./routes/recycle");
const findFavPinned = require("./utils/findFavPin.module");
const cdnRouter = require("./routes/create_cdn_links");
const io = socket.init(server);

io.on("connection", (socket) => {
  socket.on("register", (userId) => {
    socket.join(userId);
    console.log("User connected:", userId);
  });
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

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
app.use("/fav", authMiddleware, favRouter);
app.use("/import-export", authMiddleware, ioRouter);
app.use("/settings", authMiddleware, sRouter);
app.use("/moveit", authMiddleware, moveRouter);
app.use("/delete", authMiddleware, deleteRouter);
app.use("/images", authMiddleware, imageRouter);
app.use("/notifications", authMiddleware, notificationRouter);
app.use("/profile", authMiddleware, profileRouter);
app.use("/auth/google", googleAuthrouter);
app.use("/payment", authMiddleware, paymentRouter);
app.use("/share", authMiddleware, shareRouter);
app.use("/language", authMiddleware, languageRouter);
app.use("/explore", authMiddleware, expoloreRouter);
app.use("/activity", authMiddleware, activityRouter);
app.use("/recyclebin", authMiddleware, recyclebinRouter);
app.use("/generate_cdn", authMiddleware, cdnRouter);

// HOME ROUTER
app.get("/", authMiddleware, async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decode = jwt.verify(token, process.env.SECRET);
    const folders = await Folder.find({
      author: decode.checkUser._id,
      isDeleted: false,
      parent: null,
    })
      .populate("author")
      .limit(5);
    const cards = await Card.find({
      author: decode.checkUser._id,
      isDeleted: false,
    })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate("author", "userName userImage");
    const card = await findFavPinned(cards, decode.checkUser._id);
    res.render("index", {
      image: decode.checkUser?.userImage || decode.user?.avatar,
      card,
      author: decode.checkUser.userName,
      userId: decode.checkUser._id,
      folders,
      app_url: process.env.APP_URL,
      appVersion,
    });
  } catch (err) {
    next(err);
  }
});

app.post("/card", async (req, res) => {
  const { title, description, content, tags, category, folderName } = req.body;

  try {
    const token = req.cookies.token;
    const decode = jwt.verify(token, process.env.SECRET);
    const { _id } = decode.checkUser;
    if (!_id) return res.status(401).json({ error: "Unauthorized" });
    tags.for;
    const createCard = await Card.create({
      title,
      description,
      content,
      tags,
      category,
      author: new mongoose.Types.ObjectId(_id),
    });
    await createActivity({
      title: "Card Created",
      author: _id,
      activity: "created",
      entityType: "snippet",
      entityId: createCard._id,
      status: "success",
    });

    try {
      const findFolder = await Folder.findOne({
        author: _id,
        folderName: folderName,
      });
      if (!findFolder) {
        const newFolder = await Folder.create({
          author: _id,
          folderName,
          cards: [createCard._id],
        });
      } else {
        findFolder.cards.push(createCard._id);
        await findFolder.save();
      }
    } catch (error) {
      res.json({ error });
    }

    res.json({ createCard });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: `Server error ${err.message}` });
  }
});
app.get("/draft", authMiddleware, async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  res.render("draft", {
    image: decode.checkUser?.userImage || decode.user?.avatar,
    author: decode.checkUser.userName,
    userId: decode.checkUser._id,
    app_url: process.env.APP_URL,
    appVersion,
  });
});

/*
Demo routes remove it before deployment
*/
app.get("/democards", async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const userEmail = decode.checkUser.email;
  const folders = await Folder.find({
    author: decode.checkUser._id,
    parent: null,
  });

  const card = await Card.find({ author: decode.checkUser._id })
    .sort({ createdAt: -1 })
    .limit(15);

  res.render("demo", {
    image: decode.checkUser?.userImage || decode.user?.avatar,
    card,
    author: decode.checkUser.userName,
    userId: decode.checkUser._id,
    folders,
  });
});

app.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

app.get("/report", authMiddleware, async (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id } = decode.checkUser;
  if (!_id) return res.status(401).json({ error: "Unauthorized" });
  const totalCards = await Card.countDocuments({
    author: _id,
    isDeleted: false,
  });
  const totalFolders = await Folder.countDocuments({
    author: _id,
    isDeleted: false,
  });
  const totalTags = (await Card.distinct("tags", { author: _id })).length;
  let dailyCounts = [];
  try {
    dailyCounts = await Card.aggregate([
      {
        $match: { author: new mongoose.Types.ObjectId(_id), isDeleted: false },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);
  } catch (error) {
    console.error("Error fetching daily counts:", error);
  }
  const languageReport = await Card.aggregate([
    { $match: { author: new mongoose.Types.ObjectId(_id), isDeleted: false } },
    {
      $group: {
        _id: "$category",
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);

  res.json({
    totalCards,
    totalFolders,
    totalTags,
    dailyCounts,
    languageReport,
  });
});

app.get("/lastactive", async (req, res) => {
  try {
    const token = req.cookies.token;
    const decode = jwt.verify(token, process.env.SECRET);
    const userId = decode.checkUser._id;
    const lastActiveTime = await User.findByIdAndUpdate(
      userId,
      { lastActive: Date.now() },
      { new: true }
    );
    const t = new Date(lastActiveTime.lastActive).toLocaleString();
    res.json({ success: true, t });
  } catch (e) {
    console.log("ERROR:", e);
    res.status(500).json({ success: false });
  }
});

app.get("/a", authMiddleware, (req, res) => {
  const token = req.cookies.token;
  const decode = jwt.verify(token, process.env.SECRET);
  const { _id, userName, goodName, email, userImage, lastActive } =
    decode.checkUser;
  res.json({ _id, userName, goodName, email, userImage, lastActive });
});

app.get("/location", async (req, res) => {
  const ip =
    req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

  const geo = await fetch(`https://ipapi.co/${ip}/json/`);
  const location = await geo.json();

  res.send(location);
});

app.use((req, res, next) => {
  res.status(404).render("pageNotFound");
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).render("error", {
    error: "Internal Server Error, try again later or contact support",
  });
});

server.listen(process.env.PORT, async () => {});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

let rs = JSON.parse(
  fs.readFileSync(path.join(__dirname, "package.json"), "utf-8")
);

global.appVersion = rs.version;
