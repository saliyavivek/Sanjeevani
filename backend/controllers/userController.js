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
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

const signup = async (req, res) => {
  try {
    const validatedData = userRegistrationSchema.parse(req.body);

    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.password, salt);

    const newUser = new User({
      ...validatedData,
      password: hashedPassword,
    });

    await newUser.save();

    const token = getToken(newUser);

    res.status(201).json({
      message: "User registered successfully",
      token,
      userId: newUser._id,
      role: newUser.role,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

const signin = async (req, res) => {
  try {
    const { email, password } = userLoginSchema.parse(req.body);

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User doesn't exists." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Password is incorrect." });
    }

    const token = getToken(user);

    res.json({
      token,
      userId: user._id,
      role: user.role,
    });
  } catch (error) {
    return res.status(500).json({ message: error });
  }
};

module.exports = { signup, signin };
