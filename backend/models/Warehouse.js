const mongoose = require("mongoose");
const { Schema } = mongoose;

const warehouseSchema = new Schema({
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  name: String,
  location: String,
  size: String,
  pricePerDay: String,
  description: String,
  availability: Boolean,
  image: {
    type: String,
    default:
      "https://plus.unsplash.com/premium_photo-1681426730828-bfee2d13861d?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    set: (v) =>
      v === ""
        ? "https://plus.unsplash.com/premium_photo-1681426730828-bfee2d13861d?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        : v,
  },
});

const Warehouse = mongoose.model("Warehouse", warehouseSchema);
module.exports = Warehouse;
