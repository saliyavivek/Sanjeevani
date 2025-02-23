const express = require("express");
const {
  addReview,
  fetchReviews,
  updateReview,
  deleteReview,
  addReplyToReview,
  editReply,
  deleteReply,
} = require("../controllers/reviewController");
const router = express.Router();

router.post("/", addReview);
router.get("/:warehouseId", fetchReviews);
router.put("/:reviewId", updateReview);
router.delete("/:reviewId", deleteReview);
router.post("/reply/:reviewId", addReplyToReview);
router.put("/reply/:reviewId", editReply);
router.delete("/reply/:reviewId", deleteReply);

module.exports = router;
