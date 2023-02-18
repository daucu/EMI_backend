const express = require("express");
const router = express.Router();
const upload = require("../config/image_upload");

const SoldProduct = require("../models/sold_product");

// code to get all products
router.get("/", async (req, res) => {
  try {
    const product = await SoldProduct.find().populate([
      {
        path: "product_id",
      },
      
    ]);

    res.json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "error in getting  product", status: "error" });
  }
});

// code to post sold product with token verification
router.post("/", async (req, res) => {
  const sold_product = new SoldProduct({
    user_id: req.body.user_id,
    product_id: req.body.product_id,
    quantity: req.body.quantity,
    total_amount: req.body.total_amount,
    down_payment: req.body.down_payment,
    time_period: req.body.time_period,
    interest_rate: req.body.interest_rate,
    emi_amount: req.body.emi_amount,
    emi_status: req.body.emi_status,
    emi_start_date: req.body.emi_start_date,
    emi_end_date: req.body.emi_end_date,
    monthly_payment: req.body.monthly_payment,
  });
  try {
    const newSoldProduct = await sold_product.save();

    res.status(201).json(newSoldProduct);
  } catch (error) {
    res.status(400).json({ message: error.message, status: "error" });
  }
});

module.exports = router;
