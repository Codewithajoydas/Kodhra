const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const coonectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSH_URI);
  } catch (error) {}
};
module.exports = coonectDB;
