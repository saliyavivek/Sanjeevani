const { google } = require("googleapis");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { v2: cloudinary } = require("cloudinary");

// const getToken = (newUser) => {
//   return jwt.sign(
//     {
//       userId: newUser._id,
//       email: newUser.email,
//       name: newUser.name,
//       role: newUser.role,
//       avatar: newUser.avatar,
//     },
//     process.env.JWT_SECRET,
//     { expiresIn: "1h" }
//   );
// };

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.BACKEND_URL}/api/auth/google/callback`
);

const getGoogleAuthURL = (req, res) => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/userinfo.email",
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
  });
  res.redirect(url); // this 'url' takes us to the page where they ask us about which email to use to login/signup
};

// Cloudinary configuration
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const handleGoogleCallback = async (req, res) => {
  try {
    const { code } = req.query;

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
    const { data } = await oauth2.userinfo.get();

    const avatarUrl = data.picture; // Get the user's avatar URL
    // console.log("Avatar URL:", avatarUrl);

    // Check if user exists or create a new one
    let user = await User.findOne({ email: data.email });
    if (!user) {
      const uploadedAvatar = await cloudinary.uploader.upload(avatarUrl, {
        folder: "sanjeevani",
      });

      const user = await User.create({
        name: data.name,
        email: data.email,
        avatar: uploadedAvatar.secure_url,
        isAssociatedWithGoogle: true,
      });
      //   console.log(user);
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          isDeactivated: user.isDeactivated,
        },
        process.env.JWT_SECRET
      );
      res.redirect(
        `${process.env.FRONTEND_URL}/auth?token=${token}&role=${user.role}`
      );
    } else {
      const token = jwt.sign(
        {
          userId: user._id,
          email: user.email,
          name: user.name,
          role: user.role,
          avatar: user.avatar,
          isDeactivated: user.isDeactivated,
        },
        process.env.JWT_SECRET
      );
      res.redirect(
        `${process.env.FRONTEND_URL}/auth?token=${token}&role=${user.role}`
      );
    }

    // res.status(200).json({
    //   message: "Google Sign-In Successful",
    //   token,
    //   userId: user._id,
    //   role: user.role,
    // });
  } catch (error) {
    console.error("Error during Google OAuth Callback:", error);
    res.status(500).send("Authentication Error");
  }
};

module.exports = { getGoogleAuthURL, handleGoogleCallback };
