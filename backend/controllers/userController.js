const User = require("../models/User");
const {
  userRegistrationSchema,
  userLoginSchema,
} = require("../validationSchemas/zodUser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

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

    res.status(200).json({ avatarUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update profile picture" });
  }
};

module.exports = {
  signup,
  signin,
  getUserDetails,
  updateUserDetails,
  updateUserAvatar,
};
