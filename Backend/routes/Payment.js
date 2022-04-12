const { createPaymentIntent, getUserPayment, stripeWebhook } = require("../Controllers/Payment/Payment")
const { authenticateUser } = require("../Controllers/User/authMiddleware")

module.exports = function(app) {
    app.post('/payment/createIntent', authenticateUser, createPaymentIntent);

    app.get('/payment/getPayment', authenticateUser, getUserPayment);
    
    app.post('/payment/webhook', stripeWebhook);
}