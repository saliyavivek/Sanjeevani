const express = require("express");
const router = express.Router();
const { signup, signin } = require("../controllers/userController");
const upload = require("../middlewares/multer");

router.post("/signup", upload.single("profilePicture"), signup);
router.post("/signin", signin);

module.exports = router;
