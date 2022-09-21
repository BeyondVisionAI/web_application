var nodemailer = require("nodemailer");
const { Errors } = require("../../Models/Errors");
const fs = require('fs');
var handlebars = require('handlebars');


let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      type: "OAuth2",
      user: process.env.GMAIL_USERNAME,
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
      accessToken: process.env.GOOGLE_ACCESS_TOKEN,
      expires: 3426,
    },
});

var wrapedSendMail = exports.wrapedSendMail = function(mailOptions) {
    return new Promise((resolve,reject) => {
        transporter.sendMail(mailOptions, function(error, info) {
            if (error) {
                console.log("🚀 ~ file: Auth.js ~ line 27 ~ transporter.sendMail ~ error", error)
        reject(false);
    } else {
        resolve(true);
      }
    });
})
}

exports.contactForm = async function (req, res) {
    console.log("🚀 ~ file: Mail.js ~ line 16 ~ process.env.GOOGLE_CLIENT_SECRET", process.env.GOOGLE_CLIENT_SECRET)
    console.log("🚀 ~ file: Mail.js ~ line 18 ~ process.env.GOOGLE_REFRESH_TOKEN", process.env.GOOGLE_REFRESH_TOKEN)
    console.log("🚀 ~ file: Mail.js ~ line 20 ~ process.env.GOOGLE_ACCESS_TOKEN", process.env.GOOGLE_ACCESS_TOKEN)
    console.log("🚀 ~ file: Mail.js ~ line 35 ~ req.body", req.body)
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
        console.log("🚀 ~ file: Mail.js ~ line 60 ~ err", err)
        return res.status(500).send(Errors.INTERNAL_ERROR);
    }
}