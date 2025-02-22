const Review = require("../models/Review");
const Warehouse = require("../models/Warehouse");
const Notification = require("../models/Notification");

const addReview = async (req, res) => {
  try {
    const {
      userName,
      warehoueName,
      userId,
      ratings,
      review,
      warehouseId,
      ownerId,
    } = req.body;
    // console.log(req.body);
    const addedReview = new Review({
      userId,
      ratings,
      review,
      warehouseId,
    });
    await addedReview.save();

    await Notification.create({
      userId: ownerId,
      content: `${userName} has add a review on your listing named ${warehoueName}.`,
      type: "general",
    });

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
      .populate("warehouseId")
      .populate({
        path: "reply",
        populate: {
          path: "ownerId",
        },
      });
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

const addReplyToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { text, userId } = req.body;

    // console.log(reviewId, text, userId);

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Check if the user is the owner of the warehouse
    const warehouse = await Warehouse.findById(review.warehouseId);
    if (!warehouse || warehouse.ownerId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Unauthorized to reply to this review" });
    }

    // Add reply to review
    review.reply = {
      text,
      ownerId: userId,
      createdAt: new Date(),
    };

    await review.save();
    res.status(200).json({ message: "Reply added successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  addReview,
  fetchReviews,
  updateReview,
  deleteReview,
  addReplyToReview,
};
