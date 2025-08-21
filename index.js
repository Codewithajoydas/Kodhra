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
const sendMail = require("./utils/sendmail.module.js");
const fpRouter = require("./routes/forgotPass.js");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const RedisStore = require("connect-redis").RedisStore;
const client = require("./config/redis.config.js");
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.set("view engine", "ejs");

const User = require("./models/User");
const connectDB = require("./config/mongoose.config");
const authMiddleware = require("./middleware/auth.middleware");
const vRouter = require("./routes/verifyEmail");
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
connectDB();
app.get("/", authMiddleware, async (req, res) => {
  const userEmail = req.cookies.token;
  const decode = jwt.verify(userEmail, process.env.SECRET);
  res.render("index", {
    image: decode.checkUser?.userImage || decode.user?.avatar,
  });
});
app.use("/login", router);
app.use("/signup", signup);
app.use("/card", authMiddleware, cardRouter);
app.use("/dlt", authMiddleware, cardRouter);
app.use("/edit", authMiddleware, cardRouter);
app.use("/forgotPass", fpRouter);
app.use("/auth/github/", gitroute);
app.use("/emailverification", vRouter);
app.use((req, res, next) => {
  res.status(404).render("pageNotFound");
});
app.listen(process.env.PORT, () => {
  console.log("Server running on http://localhost:5000");
});
