require("dotenv").config();
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB);
    console.log(
      "EMI Database Connected Successfuly----------------------"
    );
  } catch (error) {
    console.log("(EMI Connection error) ", error);
  }
};
module.exports = connectDB;
