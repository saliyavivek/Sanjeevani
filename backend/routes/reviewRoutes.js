const express = require("express");
const {
  addReview,
  fetchReviews,
  updateReview,
  deleteReview,
  addReplyToReview,
} = require("../controllers/reviewController");
const router = express.Router();

router.post("/", addReview);
router.get("/:warehouseId", fetchReviews);
router.put("/:reviewId", updateReview);
router.delete("/:reviewId", deleteReview);
router.post("/reply/:reviewId", addReplyToReview);

module.exports = router;
