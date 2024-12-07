const express = require("express");
const {
  addReview,
  fetchReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");
const router = express.Router();

router.post("/", addReview);
router.get("/:warehouseId", fetchReviews);
router.put("/:reviewId", updateReview);
router.delete("/:reviewId", deleteReview);

module.exports = router;
