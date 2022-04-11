const { Errors } = require("../../Models/Errors");
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
var validateCurrencyCode = require('validate-currency-code');
const { Payment } = require("../../Models/Payment");
const endpointSecret = 'whsec_...';


function isNumeric(value) {
    return /[+-]?([0-9]*[.])?[0-9]+/.test(value);
}

exports.createPaymentIntent = async function (req, res) {
    if (!req.body.amount || !req.body.currency) {
      return res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS);
    }
    if (!isNumeric(req.body.amount) || !validateCurrencyCode(req.body.currency)) {
        return res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS);
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: parseFloat(req.body.amount)*100,
            currency: req.body.currency,
            automatic_payment_methods: {enabled: true},
        });
        const newPayment = new Payment({
            userId: req.user.userId,
            paymentIntentId: paymentIntent.id,
            paymentAmount: paymentIntent.amount,
            paymentCurrency: paymentIntent.currency,
        })
        await newPayment.save(async (err) => {
            console.log("🚀 ~ file: Payment.js ~ line 23 ~ paymentIntent", paymentIntent)
            if (err) return res.status(500).send(Errors.INTERNAL_ERROR);
            res.status(200).json({
                'clientSecret': paymentIntent.client_secret
            })
        })
    } catch (err) {
        console.error("Error in create Payment Intent:", err)
        return res.status(500).send(Errors.INTERNAL_ERROR)
    }
};

exports.getUserPayment = async function (req, res) {
    Payment.find({userId: req.user.userId}, async (err, docs) => {
        console.log("🚀 ~ file: Payment.js ~ line 46 ~ Payment.find ~ docs", docs)
        if (err) return res.status(500).send(Errors.INTERNAL_ERROR);
        res.status(200).json(docs);
    })
}

exports.stripeWebhook = async function (req, res) {
    let event = req.body;
    if (endpointSecret) {
        const signature = req.headers["stripe-signature"];
        try {
            event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            endpointSecret
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`, err.message);
            return res.sendStatus(400);
        }
    }

    switch (event.type) {
        case "payment_intent.succeeded":
            var paymentIntent = event.data.object;
            Payment.findOne({paymentIntentId: paymentIntent.id}, (err, doc) => {
                if (err) return res.status(500).send(Errors.INTERNAL_ERROR);
                var newDoc = {...doc._doc}
                newDoc.paymentStatus = 'success'
                doc.overwrite(newDoc)
                doc.save((err) => {
                    if (err) return res.status(500).send(Errors.INTERNAL_ERROR);
                    return res.status(200).send("Success");
                })
            })
            break;
        case "payment_intent.payment_failed":
            paymentIntent = event.data.object;
            Payment.findOne({paymentIntentId: paymentIntent.id}, (err, doc) => {
                if (err) return res.status(500).send(Errors.INTERNAL_ERROR);
                var newDoc = {...doc._doc}
                newDoc.paymentStatus = 'failed'
                doc.overwrite(newDoc)
                doc.save((err) => {
                    if (err) return res.status(500).send(Errors.INTERNAL_ERROR);
                    return res.status(200).send("Success");
                })
            })
            break;
        default:
            console.log(`Unhandled event type ${event.type}.`);
    }

    // Return a 200 response to acknowledge receipt of the event
    res.send();
};
