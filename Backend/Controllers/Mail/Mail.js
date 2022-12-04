const nodemailer = require("nodemailer");
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID, // ClientID
    process.env.GOOGLE_CLIENT_SECRET, // Client Secret
    process.env.GOOGLE_REDIRECT_URI // Redirect URL
);
oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});
const accessToken = oauth2Client.getAccessToken()

const smtpTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
        type: "OAuth2",
        user: process.env.GMAIL_USERNAME,
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
        accessToken: accessToken
    },
    // tls: {
    //     rejectUnauthorized: false
    // }
});

var wrapedSendMail = exports.wrapedSendMail = function (mailOptions) {
    return new Promise((resolve, reject) => {
        smtpTransport.sendMail(mailOptions, function (error, info) {
            if (error) {
                reject(false);
            } else {
                resolve(true);
            }
        });
    })
}

exports.contactForm = async function (req, res) {
    if (!req.body || !req.body.name || !req.body.email || !req.body.message) {
        return res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS)
    }
    var emailHtml = fs.readFileSync(require('path').resolve(__dirname, '../../Models/emailTemplates/contactForm.html'), 'utf-8')
    var template = handlebars.compile(emailHtml);
    var replacements = {
        name: req.body.name,
        messageBody: req.body.message,
        emailAddress: req.body.email,
        emailAddressHref: `mailto:${req.body.email}`,
    };
    var htmlToSend = template(replacements);
    const mailData = {
        from: process.env.GMAIL_USERNAME,
        to: process.env.GMAIL_USERNAME,
        subject: "Contact Form Entry",
        text: `New entry from ${req.body.name}. ${req.body.message}\n Respond to ${req.body.email}`,
        html: htmlToSend,
    };
    try {
        await wrapedSendMail(mailData)
        return res.status(200).send("Success");
    } catch (err) {
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}