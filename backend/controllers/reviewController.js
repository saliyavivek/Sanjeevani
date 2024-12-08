const Review = require("../models/Review");

const addReview = async (req, res) => {
  try {
    const { userId, ratings, review, warehouseId } = req.body;
    console.log(req.body);
    const addedReview = new Review({
      userId,
      ratings,
      review,
      warehouseId,
    });
    await addedReview.save();
    res.status(201).json({
      message: "Review added.",
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

const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { ratings, review } = req.body;

    const updatedReview = await Review.findByIdAndUpdate(
      reviewId,
      {
        ratings,
        review,
      },
      { new: true }
    );

    if (!updatedReview) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.status(201).json({ message: "Review updated.", updatedReview });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    // console.log(reviewId);
    const deletedReview = await Review.deleteOne({ _id: reviewId });

    if (!deletedReview) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.status(201).json({ message: "Review deleted.", deletedReview });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

module.exports = { addReview, fetchReviews, updateReview, deleteReview };
