const mongoose = require("mongoose");

const list = new mongoose.Schema({
    name: String,
});

exports.List = mongoose.model("List", list);