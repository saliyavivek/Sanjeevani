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
const Wishlist = require("../models/Wishlist");

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
      isDeactivated: newUser.isDeactivated,
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
      isDeactivated: user.isDeactivated,
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

  // console.log(userId, updates);

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
    });

    if (updates.name && updatedUser.name !== user.name) {
      await Notification.create({
        userId,
        content: `Your display name has been changed to ${updatedUser.name}.`,
        type: "general",
      });
    }
    if (updates.email && updatedUser.email !== user.email) {
      await Notification.create({
        userId,
        content: `Your email address has been updated to ${updatedUser.email}.`,
        type: "general",
      });
    }
    if (updates.phoneno && updatedUser.phoneno !== user.phoneno) {
      await Notification.create({
        userId,
        content: `Your phone number has been updated to ${updatedUser.phoneno}.`,
        type: "general",
      });
    }
    if (updates.address && updatedUser.address !== user.address) {
      await Notification.create({
        userId,
        content: `Your address has been updated to ${updatedUser.address}.`,
        type: "general",
      });
    }

    res.status(200).json(updatedUser); // Send back the updated user
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

  if (!user.isAssociatedWithGoogle) {
    return res.status(404).json({
      userId: user._id,
      message: "Email is not associated with Google",
    });
  }

  // Send the email
  const transporter = nodemailer.createTransport({
    service: "gmail", // Use your email provider
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
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

    if (!userId) {
      return res.status(401).json({ message: "user id is required" });
    }

    const searchedUser = await User.findById(userId);

    if (!searchedUser) {
      return res.status(401).json({ message: "no such user found." });
    }

    const warehousesToDelete = await Warehouse.find({ ownerId: userId });

    const bookingIdsToDelete = warehousesToDelete.flatMap(
      (warehouse) => warehouse.bookings
    );

    await User.findByIdAndDelete(userId);
    await Warehouse.deleteMany({ ownerId: userId });
    await Booking.deleteMany({
      $or: [
        { userId: userId }, // Delete user's own bookings
        { _id: { $in: bookingIdsToDelete } }, // Delete bookings of deleted warehouses
      ],
    });
    await Notification.deleteMany({ userId: userId });
    await Review.deleteMany({ userId: userId });
    await Wishlist.deleteMany({ user: userId });

    // console.log("user deleted", user);

    res
      .status(200)
      .json({ message: "Your account has been deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete account" });
  }
};

const totalUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "admin" } });

    const totalUsers = users.length;
    // console.log(totalUsers);
    res.status(200).json({ totalUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch total users" });
  }
};

const fetchAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({ role: { $ne: "admin" } });
    const updatedUsersMap = new Map(); // to store user with canDelete flag

    for (const user of allUsers) {
      const userObj = user.toObject();
      userObj.canDelete = true; // default

      const booking = await Booking.findOne({
        userId: user._id,
        approvalStatus: "approved",
        status: { $in: ["active", "pending"] },
      }).populate({
        path: "warehouseId",
        select: "ownerId",
      });

      if (booking) {
        userObj.canDelete = false;

        // Mark the warehouse owner as canDelete = false
        const ownerId = booking?.warehouseId?.ownerId;
        if (ownerId) {
          const ownerKey = ownerId.toString();
          if (!updatedUsersMap.has(ownerKey)) {
            const ownerUser = await User.findById(ownerId);
            if (ownerUser && ownerUser.role !== "admin") {
              const ownerObj = ownerUser.toObject();
              ownerObj.canDelete = false;
              updatedUsersMap.set(ownerKey, ownerObj);
            }
          } else {
            // If already in map, just make sure canDelete is false
            const existing = updatedUsersMap.get(ownerKey);
            existing.canDelete = false;
          }
        }
      }

      updatedUsersMap.set(user._id.toString(), userObj);
    }

    const updatedUsers = Array.from(updatedUsersMap.values());
    res.status(200).json({ allUsers: updatedUsers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch all users" });
  }
};

const fetchUserDetailsForAdmin = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });

    // console.log(user);
    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user details" });
  }
};

const manageUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findOne({ _id: userId });

    if (!user) {
      return res.status(401).json({ message: "user not found" });
    }

    if (user.isDeactivated == true) {
      user.isDeactivated = false;
      await user.save();
      res.status(200).json({ user, message: "User has been activated." });
    } else {
      user.isDeactivated = true;
      await user.save();
      res.status(200).json({ user, message: "User has been deactivated." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to deactivate user" });
  }
};

const assignRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({ message: "No such user found" });
    }

    user.role = role;
    await user.save();
    res.status(200).json({ message: "Role has been assigned" });
  } catch (error) {
    res.status(500).json({ error: "Failed to assign role" });
  }
};

const verifyResetToken = async (req, res) => {
  try {
    const { userId, token } = req.body;

    const user = await User.findOne({
      _id: userId,
      resetToken: token,
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Your token is either invalid or is expired." });
    }

    res.status(200).json({ message: "Reset Code is verified successfully." });
  } catch (error) {
    res.status(500).json({ error: "Failed to assign role" });
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
  totalUsers,
  fetchAllUsers,
  fetchUserDetailsForAdmin,
  manageUser,
  assignRole,
  verifyResetToken,
};
