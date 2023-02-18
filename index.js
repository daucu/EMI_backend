const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT || 4000;
const multer = require("multer");
const cookieParser = require("cookie-parser");
const fs = require("fs");
app.use(express.static(__dirname + "/"));
app.use(cookieParser());

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "EMI Api is  working" });
});

//Loop of allowed origins
const allowedOrigins = [
  "https://angler360-front.vercel.app",
  "http://localhost:3000",
  "http://localhost:3001",
];

//CORS policy access
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

const connectDB = require("./config/database");
connectDB();

app.use("/api/getuser", require("./routes/register"));

// singup API
app.use("/api/signup", require("./routes/register"));

// login api
app.use("/api/login", require("./routes/login"));

// logout api
app.use("/api/logout", require("./routes/logout"));

// Profile req and res
app.use("/api/profile", require("./Profile/Userprofile"));

// Product add
app.use("/api/product", require("./routes/product"));

// sold product
app.use("/api/soldproduct", require("./routes/sold_product_api"));

// Bank details
app.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
