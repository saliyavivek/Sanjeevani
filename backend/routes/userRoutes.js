const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  getUserDetails,
  updateUserDetails,
  updateUserAvatar,
} = require("../controllers/userController");
const upload = require("../middlewares/multer");

router.post("/", getUserDetails);
router.patch("/:userId", updateUserDetails);
router.put("/:userId/avatar", upload.single("avatar"), updateUserAvatar);
router.post("/signup", upload.single("profilePicture"), signup);
router.post("/signin", signin);

module.exports = router;
