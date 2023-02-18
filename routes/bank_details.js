// const express = require("express");
// const router = express.Router();

// const BankDetails = require("../models/bankdetails");

// // code to get all bank details from database
// router.get("/", async (req, res) => {
//   try {
//     const bankdetails = await BankDetails.find();
//     res.json(bankdetails);
//   } catch (error) {
//     res.status(500).json({ message: "error in getting bank details" });
//   }
// });

// //  code to post bank details with token
// router.post("/", async (req, res) => {
//   try {
//     const token =
//       req.body.token || req.cookies.token || req.headers["x-access-token"];
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const bankdetails = new BankDetails({
//       bank_name: req.body.bank_name,
//       account_name: req.body.account_name,
//       account_type: req.body.account_type,
//       pan_card: req.body.pan_card,
//       ifsc_code: req.body.ifsc_code,
//       branch_name: req.body.branch_name,
//       branch_address: req.body.branch_address,
//       branch_city: req.body.branch_city,
//       branch_state: req.body.branch_state,
//       branch_pincode: req.body.branch_pincode,
//       token: token,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "error in posting bank details" });
//   }
// });
// module.exports = router;
