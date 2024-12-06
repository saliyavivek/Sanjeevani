const Review = require("../models/Review");

const addReview = async (req, res) => {
  try {
    const { userId, ratings, review } = req.body;
    const addedReview = new Review({
      userId,
      ratings,
      review,
    });
    await addedReview.save();
    res.status(201).json({
      message: "Review added successfully.",
      addedReview,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

const fetchReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ warehouseId: req.params.warehouseId })
      .populate("userId")
      .populate("warehouseId");
    if (reviews.length > 0) {
      return res.status(200).json({ message: "Reviews found.", reviews });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

module.exports = { addReview, fetchReviews };
