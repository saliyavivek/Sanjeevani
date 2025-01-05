const express = require("express");
const {
  addToWishlist,
  getUserWishlist,
  isWishlistedByUser,
  removeFromWishlist,
} = require("../controllers/wishlistController");
const router = express.Router();

router.get("/get/:id", getUserWishlist);
router.post("/add/:id", addToWishlist);
router.post("/checkStatus/:id", isWishlistedByUser);
router.delete("/remove/:id", removeFromWishlist);

module.exports = router;
