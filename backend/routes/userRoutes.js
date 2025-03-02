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
  totalUsers,
  fetchAllUsers,
  fetchUserDetailsForAdmin,
  manageUser,
  assignRole,
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
router.get("/total-users", totalUsers);
router.get("/all-users", fetchAllUsers);
router.get("/user/:userId", fetchUserDetailsForAdmin);
router.put("/user/:userId/manage", manageUser);
router.put("/:userId/assign-role", assignRole);

module.exports = router;
