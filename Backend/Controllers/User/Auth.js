const { User } = require("../../Models/User");
const jwt = require("jsonwebtoken")
const { v4: uuidv4 } = require('uuid');
var nodemailer = require('nodemailer');
const bcrypt = require("bcryptjs");

const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
       auth: {
            user: process.env.GMAIL_USERNAME,
            pass: process.env.GMAIL_PASSWORD,
         },
    secure: true,
});


exports.register = async function(req, res) {
    if (!req.body.username || !req.body.password || !req.body.email) {
        return res.status(400).send("Bad Request")
    }

    User.findOne({ email: req.body.email }, async (err, doc) => {
        if (err) throw err;
        if (doc) return res.status(409).send("Email Already In Use");
    });
    User.findOne({ username: req.body.username }, async (err, doc) => {
        if (err) throw err;
        if (doc) return res.status(409).send("Username Already In Use");
    });

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    var verifUID = uuidv4()
    const newUser = new User({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email,
        verificationUID: verifUID,
    });
    await newUser.save((err) => {
        console.error("🚀 ~ file: Auth.js ~ line 45 ~ awaitnewUser.save ~ err", err)
        if (err) return res.status(500).send("Internal Error")
    });

    const mailData = {
        from: process.env.GMAIL_USERNAME,  
        to: req.body.email,   
        subject: 'Sending Email using Node.js',
        text: verifUID,
    };

    transporter.sendMail(mailData, function (err, info) {
        console.error("🚀 ~ file: Auth.js ~ line 58 ~ err", err)
        if (err) return res.status(500).send("Internal Error")
        res.status(500).send("Success")
     });

}

exports.login = async function(req, res) {
    if (!req.body.username || !req.body.password) {
        return res.status(400).send("Bad Request")
    }
    User.findOne({ username: req.body.username }, async (err, doc) => {
        if (err) throw err;
        if (!doc) return res.status(404).send("Not Found");
        if (bcrypt.compare(req.body.password, doc.password)) {
            if (!doc.isEmailConfirmed) {
                return res.status(401).send('Account Not Verified')
            }
            var userWithoutPassword = {
                username: doc.username,
                email: doc.email
            }
            var userJWT = jwt.sign(userWithoutPassword, process.env.JWT_SECRETKEY, {expiresIn: '15m'})
            res.cookie("token", userJWT, {
                httpOnly: true,
                // secure: true,
                // maxAge: 15*60,
                // signed: true
            })
            return res.status(200).send("Ok")
        } else {
            return res.status(401).send("Inavlid Password")
        }
    });
}

exports.verifyEmail = async function(req, res) {
   return res.status(501).send("Not Implemented")
}

exports.changePassword = async function(req, res) {
    return res.status(501).send("Not Implemented")
   
}

exports.askForPasswordChange = async function(req, res) {
    return res.status(501).send("Not Implemented")
   
}