const express = require("express");
const {
  getGoogleAuthURL,
  handleGoogleCallback,
} = require("../controllers/authController");
const router = express.Router();

router.get("/google", getGoogleAuthURL);
router.get("/google/callback", handleGoogleCallback);

module.exports = router;
