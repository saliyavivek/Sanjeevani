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

    const warehouse = await Warehouse.findOne({ _id: warehouseId });
    warehouse.reviews.push(addedReview._id);
    await warehouse.save();

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
    const warehouse = await Warehouse.findById(review.warehouseId).populate(
      "ownerId"
    );

    // console.log(warehouse);
    if (!warehouse || warehouse.ownerId._id.toString() !== userId) {
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

    await Notification.create({
      userId: review.userId,
      content: `Warehouse owner ${warehouse.ownerId.name} has replied to your review on ${warehouse.name}.`,
      type: "general",
    });
    res.status(200).json({ message: "Reply added successfully", review });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const editReply = async (req, res) => {
  try {
    const { text, userId } = req.body;
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Ensure only the owner can edit
    if (review.reply?.ownerId.toString() !== userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to edit this reply" });
    }

    review.reply.text = text;
    await review.save();

    res.status(200).json({ message: "Reply updated", reply: review.reply });
  } catch (error) {
    res.status(500).json({ message: "Error updating reply", error });
  }
};

const deleteReply = async (req, res) => {
  try {
    const { reviewId } = req.params;

    const review = await Review.findById(reviewId);
    if (!review) return res.status(404).json({ message: "Review not found" });

    // Ensure only the owner can delete
    if (review.reply?.ownerId.toString() !== req.body.userId) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this reply" });
    }

    review.reply = undefined;
    await review.save();

    res.status(200).json({ message: "Reply deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting reply", error });
  }
};

module.exports = {
  addReview,
  fetchReviews,
  updateReview,
  deleteReview,
  addReplyToReview,
  editReply,
  deleteReply,
};
