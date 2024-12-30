const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  getUserDetails,
  updateUserDetails,
  updateUserAvatar,
  requestPasswordReset,
  resetPassword,
  deleteAccount,
} = require("../controllers/userController");
const upload = require("../middlewares/multer");

router.post("/", getUserDetails);
router.patch("/:userId", updateUserDetails);
router.put("/:userId/avatar", upload.single("avatar"), updateUserAvatar);
router.post("/signup", upload.single("profilePicture"), signup);
router.post("/signin", signin);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/delete-account", deleteAccount);

module.exports = router;
