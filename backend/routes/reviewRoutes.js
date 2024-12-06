const express = require("express");
const { addReview, fetchReviews } = require("../controllers/reviewController");
const router = express.Router();

router.post("/", addReview);
router.get("/:warehouseId", fetchReviews);

module.exports = router;
