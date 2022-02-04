const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');

const user = new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  isEmailConfirmed: { type :Boolean, default: false },
  verificationUID: { type: String, default: uuidv4() }
});

exports.User = mongoose.model("User", user);