const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  name: String,
  email: String,
  password: String,
  about: String,
  role: {
    type: String,
    enum: ["farmer", "owner", "admin", "anonymous"],
    default: "anonymous",
  },
  phoneno: String,
  avatar: String,
  address: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isDeactivated: {
    type: Boolean,
    default: false,
  },
  isAssociatedWithGoogle: { type: Boolean, default: false },
  resetToken: { type: String, default: null },
  resetTokenExpiry: { type: Date, default: null },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
