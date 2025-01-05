const Wishlist = require("../models/Wishlist");

const addToWishlist = async (req, res) => {
  const warehouseId = req.params.id;
  const { userId } = req.body;
  //   console.log(warehouseId, userId);
  try {
    const existing = await Wishlist.findOne({
      user: userId,
      warehouse: warehouseId,
    });
    if (existing) {
      return res.status(200).json({ message: "Warehouse already in wishlist" });
    }

    const wishlistItem = new Wishlist({
      user: userId,
      warehouse: warehouseId,
    });

    await wishlistItem.save();
    // console.log("Warehouse added to wishlist");
    res.status(200).json({ message: "Warehouse added to wishlist" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error adding warehouse to wishlist", error });
  }
};

const getUserWishlist = async (req, res) => {
  try {
    const userId = req.params.id;

    const wishlist = await Wishlist.find({ user: userId }).populate(
      "warehouse"
    );

    return res
      .status(200)
      .json({ message: "Fetched user wishlists", wishlist });
  } catch (error) {
    res.status(500).json({ message: "Error fetching user wishlists", error });
  }
};

const isWishlistedByUser = async (req, res) => {
  const warehouseId = req.params.id;
  const { userId } = req.body;
  //   console.log(userId);

  try {
    const wishlisted = await Wishlist.findOne({
      user: userId,
      warehouse: warehouseId,
    });

    // console.log(!!wishlisted);
    return res.status(200).json({ message: "found", wishlisted }); // Returns true if found, false otherwise
  } catch (error) {
    console.error("Error checking wishlist status", error);
    return false;
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const warehouseId = req.params.id;
    const { userId } = req.body;
    // console.log(warehouseId);

    await Wishlist.findOneAndDelete({ user: userId, warehouse: warehouseId });
    res.status(200).json({ message: "Warehouse removed from wishlist" });
  } catch (error) {
    console.error("Error deleting wishlist", error);
    return false;
  }
};

module.exports = {
  addToWishlist,
  getUserWishlist,
  isWishlistedByUser,
  removeFromWishlist,
};
