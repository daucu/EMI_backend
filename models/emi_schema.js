const mongoose = require("mongoose");

const emi_schema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  device_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Device",
  },
  total_amount: {
    type: Number,
    required: true,
  },
  remaining_amount: {
    type: Number,
    required: true,
    default: 0
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
  paid_installment: {
    type: Number,
    required: true,
    default: 0,
  },
  monthly_emi: {
    type: Number,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  payment_mode: {
    type: String,
    default: "cash",
    enum: ["cash", "card", "upi", "emi"],
  },
  transaction_id: {
    type: String,
  },
  history: [
    {
      type: mongoose.Schema.Types.Mixed,
    }
  ],
  next_emidate: {
    type: Date,
    required: true,
  }
},{
  timestamps: true
});


emi_schema.post("save", function() {
  if(this.paid_installment === this.time_period && this.completed === false) {
    this.set({
      completed: true,
    })
  }
});



module.exports = mongoose.model("Emi", emi_schema);
