const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    userName: String,
    email: String,
    password: String,
})

const userData = mongoose.model("userData", userSchema);
module.exports = userData;