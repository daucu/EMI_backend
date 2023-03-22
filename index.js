require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const PORT = process.env.PORT || 4000;
const cookieParser = require("cookie-parser");

const connectDB = require("./config/database");
const logger = require("./config/logger");
const { getQRCode } = require("./routes/qrcode");
connectDB();

//Loop of allowed origins
const allowedOrigins = [
  "https://angler360-front.vercel.app",
  "http://localhost:3000",
  "https://emi-dashboard-9edcp8.dauqu.host"
];

// static files
app.use(express.static(__dirname + "/medias"));
app.use(express.static(__dirname + "/qrcodes"));
app.use(express.static(__dirname + "/uploads"));

// middlewares 
app.use(logger)
app.use(cookieParser());
app.use(express.json());

//CORS policy access
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);


// test route
app.get("/", (req, res) => {
  res.json({ message: "EMI Api is  working ..." });
});

// qr code route
app.get("/api/qrcode", async (req, res) => {
  const qrcode = await getQRCode(req, {
    additional: "additional",
  });

  res.json(qrcode);
});

// ===-===-=== all routes ===-===-===
//dashboard
app.use("/api/dashboard", require("./routes/dashboard"));


// register
app.use("/api/register", require("./routes/register"));

// users
app.use("/api/users", require("./routes/users"));

// emi details
app.use("/api/emi", require("./routes/emis"));

// login api
app.use("/api/login", require("./routes/login"));

// logout api
app.use("/api/logout", require("./routes/logout"));

// Profile req and res
app.use("/api/profile", require("./Profile/Userprofile"));

// Product add
app.use("/api/product", require("./routes/product"));

// sold product
app.use("/api/soldproduct", require("./routes/sold_product"));

// file upload
app.use("/api/upload", require("./routes/fileupload"));

// Bank details
app.use("/api/bank", require("./routes/bank"));

// activity details
app.use("/api/activity", require("./routes/activity"));

// activity details
app.use("/api/devices", require("./routes/devices"));

// activity details
app.use("/api/transactions", require("./routes/transaction"));

// history details
app.use("/api/history", require("./routes/history"));

// notification details
app.use("/api/notification", require("./routes/notification"));

// history details
app.use("/api/payments", require("./routes/payments"));


app.listen(PORT, () => {
  console.log(`server is running on ${PORT} !!`);
});
