const express = require("express");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const router = require("./routes/authentication");
const signup = require("./routes/authoraization");
const cardRouter = require("./routes/card");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const path = require("path");
app.use(express.static(path.join(__dirname, "public")));
app.use(cookieParser());
app.set("view engine", "ejs");
const User = require("./models/User");
const connectDB = require("./config/mongoose.config");
const authMiddleware = require("./middleware/auth.middleware");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
connectDB();
app.get("/", authMiddleware, async (req, res) => {
  const userEmail = req.cookies.token;
  const decode = jwt.verify(userEmail, process.env.SECRET);
  res.render("index", { image: decode.checkUser.userImage });
});
app.use("/login", router);
app.use("/signup", signup);
app.use("/card", authMiddleware, cardRouter);
app.use("/dlt", authMiddleware, cardRouter);
app.use("/edit", authMiddleware, cardRouter);

app.listen(process.env.PORT, () => {
  console.log("Server running on http://localhost:5000");
});
