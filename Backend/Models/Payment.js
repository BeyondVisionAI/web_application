const mongoose = require("mongoose");

const payment = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userId",
        required: true
    },
    paymentIntentId: String,
    paymentAmount: String,
    paymentStatus: {
        type: String,
        enum: ['failed', 'in progress', 'success', 'refunded'],
        default: 'in progress'
    },
    paymentCurrency: String,
});

exports.Payment = mongoose.model("Payment", payment);