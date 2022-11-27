const mongoose = require("mongoose");

exports.PaymentStatus = PaymentStatus = {
    failed: 'failed',
    inProgress: 'in progress',
    success: 'success',
    refunded: 'refunded'
}


const payment = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "userId",
        required: true
    },
    projectId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "project",
        required: true
    },
    paymentIntentId: String,
    paymentAmount: String,
    paymentStatus: {
        type: String,
        enum: [PaymentStatus.failed, PaymentStatus.inProgress, PaymentStatus.success, PaymentStatus.refunded],
        default: 'in progress'
    },
    paymentCurrency: String,
});

exports.Payment = mongoose.model("Payment", payment);