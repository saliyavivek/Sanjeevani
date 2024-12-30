const User = require("../models/User");
const Notification = require("../models/Notification");
const {
  userRegistrationSchema,
  userLoginSchema,
} = require("../validationSchemas/zodUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const Warehouse = require("../models/Warehouse");
const Booking = require("../models/Booking");
const Review = require("../models/Review");

function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

const getToken = (newUser) => {
  return jwt.sign(
    {
      userId: newUser._id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      avatar: newUser.avatar,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const signup = async (req, res) => {
  try {
    const validatedData = userRegistrationSchema.parse(req.body);
    const imageUrl = req.file ? req.file.path : null;

    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with the given email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    const newUser = new User({
      ...validatedData,
      password: hashedPassword,
      avatar: imageUrl,
    });

    await newUser.save();

    const token = getToken(newUser);

    res.status(201).json({
      message: "User registered.",
      token,
      userId: newUser._id,
      role: newUser.role,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = userLoginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with the given email doesn't exists." });
    }
    // if (user && user.role !== role) {
    //   return res
    //     .status(400)
    //     .json({ message: "User with the provided role doesn't exists." });
    // }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect." });
    }

    const token = getToken(user);
    // console.log(user);

    res.json({
      message: "User logged in.",
      token,
      userId: user._id,
      role: user.role,
    });
  } catch (error) {
    // console.log(error.errors[0].message);
    return res.status(500).json({ message: error.errors[0].message });
  }
};

const getUserDetails = async (req, res) => {
  try {
    // console.log(req.body);

    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ message: "user id is required." });
    }

    const user = await User.findOne({ _id: userId });
    if (!user) {
      return res.status(400).json({ message: "user does not found." });
    }
    // console.log(user);

    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user details." });
  }
};

const updateUserDetails = async (req, res) => {
  const { userId } = req.params;
  const updates = req.body;

  console.log(userId, updates);

  try {
    const user = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (updates.name) {
      await Notification.create({
        userId,
        content: `Your display name has been changed to ${user.name}.`,
        type: "general",
      });
    }
    if (updates.email) {
      await Notification.create({
        userId,
        content: `Your email address has been updated to ${user.email}.`,
        type: "general",
      });
    }
    if (updates.phoneno) {
      await Notification.create({
        userId,
        content: `Your phone number has been updated to ${user.phoneno}.`,
        type: "general",
      });
    }

    res.status(200).json(user); // Send back the updated user
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Failed to update user" });
  }
};

const updateUserAvatar = async (req, res) => {
  try {
    const { userId } = req.params;
    const avatarUrl = req.file ? req.file.path : null;
    // console.log(userId, req.file);

    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarUrl },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    await Notification.create({
      userId,
      content: `Your profile picture has been updated.`,
      type: "general",
    });

    res.status(200).json({ avatarUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update profile picture" });
  }
};

const requestPasswordReset = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "Email not found" });
  }

  const token = generateToken();
  const expiresAt = Date.now() + 15 * 60 * 1000; // 15 minutes expiry

  await User.updateOne(
    { email },
    { resetToken: token, resetTokenExpiry: expiresAt }
  );

  // Send the email
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const resetLink = `http://localhost:5173/reset-password?token=${token}`;
  const templatePath = path.join(__dirname, "../utils/emailTemplate.html");
  const htmlTemplate = fs.readFileSync(templatePath, "utf8");
  const htmlContent = htmlTemplate
    .replace("${resetLink}", resetLink)
    .replace("${name}", user.name);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Reset your password",
    text: `You requested a password reset. Use the following link to reset your password: ${resetLink}`,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);

  res.status(200).json({ message: "Password reset link sent to your email" });
};

const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await User.findOne({
    resetToken: token,
    resetTokenExpiry: { $gt: Date.now() }, // Check expiry
  });

  if (!user) {
    return res.status(400).json({ message: "Invalid or expired token" });
  }

  // Hash the new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update the password and remove the reset token
  user.password = hashedPassword;
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;
  await user.save();

  res.status(200).json({ message: "Password successfully reset" });
};

const deleteAccount = async (req, res) => {
  try {
    const userId = req.body.userId;

    await Warehouse.deleteMany({ ownerId: userId });
    await Booking.deleteMany({ userId: userId });
    await Notification.deleteMany({ userId: userId });
    await Review.deleteMany({ userId: userId });

    const user = await User.findByIdAndDelete(userId);
    // console.log("user deleted", user);

    res
      .status(200)
      .json({ message: "Your account has been deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete account" });
  }
};

module.exports = {
  signup,
  signin,
  getUserDetails,
  updateUserDetails,
  updateUserAvatar,
  requestPasswordReset,
  resetPassword,
  deleteAccount,
};
