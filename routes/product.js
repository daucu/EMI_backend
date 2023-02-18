const express = require("express");
const router = express.Router();
const upload = require("../config/image_upload");
const mongoose = require("mongoose");
const Product = require("../models/product_schema");

// code to get all products
router.get("/", async (req, res) => {
  try {
    const product = await Product.find();
    res.json(product);
  } catch (error) {
    res
      .status(500)
      .json({ message: "error in getting  product", status: "error" });
  }
});

// code to post product with image
router.post("/", upload.single("image"), async (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  console.log(req.body);

  //   code to generate sku
  const sku = Math.floor(100000 + Math.random() * 900000);

  // code to add product
  const product = new Product({
    name: req.body.name,
    price: req.body.price,
    image: url + "/images/" + req.file.filename,
    description: req.body.description,
    category: req.body.category,
    quantity: req.body.quantity,
    status: req.body.status,
    sku: sku,
  });
  try {
    const newProduct = await product.save();

    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message, status: "error" });
  }
});

module.exports = router;
