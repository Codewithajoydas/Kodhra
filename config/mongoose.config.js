const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();
const coonectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSH_URI);
    console.log("DB Connected Successfully");
  } catch (error) {
    console.log("DB Not connected due to \n", error);
  }
};
module.exports = coonectDB;
