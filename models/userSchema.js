const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: [true, "Email is Already Taken"],
  },
  password: {
    type: String,
    required: true,
    minlength: [8, "Your Password Length Should be atleat 8 Character"],
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
