const mongoose = require("mongoose");

const BankDetails = new mongoose.Schema({
    account_number: {
        type: String,
    },
    ifsc: {
        type: String,
    },
    bank_name: {
        type: String,
    },
    branch_name: {
        type: String,
    },
    address: {
        type: String,

    },
});

module.exports = mongoose.model("Bank", BankDetails);
