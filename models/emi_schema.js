const mongoose = require("mongoose");

const emi_schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  total_amount: {
    type: Number,
    required: true,
  },
  down_payment: {
    type: Number,
    required: true,
  },
  time_period: {
    type: Number,
    required: true,
  },
  interest_rate: {
    type: Number,
    required: true,
  },
  monthly_emi: {
    type: Number,
    required: true,
  },
  history: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Emi",
    }
  ],
});

module.exports = mongoose.model("Emi", emi_schema);
