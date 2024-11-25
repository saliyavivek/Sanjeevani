const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["farmer", "admin"],
    default: "farmer",
  },
  phoneno: String,
});

const User = mongoose.model("User", userSchema);
module.exports = User;
