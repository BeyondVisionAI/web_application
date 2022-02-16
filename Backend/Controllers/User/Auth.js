const { User } = require("../../Models/User");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
var nodemailer = require("nodemailer");
const bcrypt = require("bcryptjs");
const { Errors } = require("../../Models/Errors");

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

async function wrapedSendMail(mailOptions) {
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

exports.register = async function (req, res) {
  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.password ||
    !req.body.email
  ) {
    return res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS);
  }
  var verifUID = uuidv4();

  User.findOne({ email: req.body.email }, async (err, doc) => {
    if (err) return res.status(500).send(Errors.INTERNAL_ERROR);
    if (doc) return res.status(409).send(Errors.EMAIL_ALREADY_IN_USE);
    else {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: hashedPassword,
        email: req.body.email,
        verificationUID: verifUID,
      });
      await newUser.save(async (err) => {
        if (err) return res.status(500).send(Errors.INTERNAL_ERROR);
        const mailData = {
          from: process.env.GMAIL_USERNAME,
          to: req.body.email,
          subject: "Verifying your Beyond Vision account",
          text: `Verify your account here: ${process.env.WEBSITE_URL}/verifyEmail?verifUID=${verifUID}`,
        };
        if (!process.env.IS_TEST) {
          try {
            await wrapedSendMail(mailData)
            return res.status(200).send("Success");
          } catch (err) {
            return res.status(500).send(Errors.INTERNAL_ERROR);
          }
        } else {
          return res.status(200).send("Success");
        }
      });
    }
  });
};

exports.login = async function (req, res) {
  if (!req.body.email || !req.body.password) {
    return res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS);
  }
  User.findOne({ email: req.body.email }, async (err, doc) => {
    if (err) throw err;
    if (!doc) return res.status(404).send(Errors.USER_NOT_FOUND);
    if (bcrypt.compare(req.body.password, doc.password)) {
      if (!doc.isEmailConfirmed && !process.env.IS_TEST) {
        return res.status(401).send(Errors.EMAIL_NOT_VERIFIED);
      }
      var userWithoutPassword = {
        firstName: doc.firstName,
        lastName: doc.lastName,
        email: doc.email,
        userId: doc._id,
      };
      var userJWT = jwt.sign(userWithoutPassword, process.env.JWT_SECRETKEY, {
        expiresIn: "15m",
      });
      res.cookie("token", userJWT, {
        httpOnly: true,
      });
      return res.status(200).send("Success");
    } else {
      return res.status(401).send(Errors.INVALID_PASSWORD);
    }
  });
};

exports.logout = async function (req, res) {
  res.clearCookie("token")
  res.status(200).send("Logout");
};

exports.verifyEmail = async function (req, res) {
  if (!req.body.verifId) return res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS);

  User.findOne({ verificationUID: req.body.verifId }, async (err, doc) => {
    if (err) return res.status(500).send(Errors.INTERNAL_ERROR)
    if (!doc) return res.status(404).send(Errors.USER_NOT_FOUND);
    var newDoc = { ...doc._doc };
    newDoc.isEmailConfirmed = true;
    newDoc.verificationUID = uuidv4();
    doc.overwrite(newDoc);
    doc.save((err) => {
      if (err) return res.status(500).send(Errors.INTERNAL_ERROR);
      return res.status(200).send("Success");
    });
  });
};

exports.changePassword = async function (req, res) {
  if (!req.body.verifId || !req.body.password) {
    return res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS);
  }
  User.findOne({ verificationUID: req.body.verifId }, async (err, doc) => {
    if (err) return res.status(500).send(Errors.INTERNAL_ERROR)
    if (!doc) return res.status(404).send(Errors.USER_NOT_FOUND);
    var newDoc = { ...doc._doc };
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    newDoc.password = hashedPassword;
    newDoc.verificationUID = uuidv4();
    doc.overwrite(newDoc);
    doc.save((err) => {
      if (err) return res.status(500).send(Errors.INTERNAL_ERROR);
      return res.status(200).send("Success");
    });
  });
};

exports.askForPasswordChange = async function (req, res) {
  if (!req.body.email) return res.status(400).send(Errors.BAD_REQUEST_MISSING_INFOS);
  User.findOne({ email: req.body.email }, async (err, doc) => {
    if (!doc) return res.status(404).send(Errors.USER_NOT_FOUND);
    if (err) return res.status(500).send(Errors.INTERNAL_ERROR);
    const mailData = {
        from: process.env.GMAIL_USERNAME,
        to: req.body.email,
        subject: "Password change request - Beyond Vision",
        text: `Reset your password here: ${process.env.WEBSITE_URL}/resetPassword?verifUID=${doc.verificationUID}`,
    };
    try {
      await wrapedSendMail(mailData)
      return res.status(200).send("Success");
    } catch (err) {
      return res.status(500).send(Errors.INTERNAL_ERROR);
    }
  });
};
