const mongoose = require("mongoose");
const { Schema } = mongoose;

const warehouseSchema = new Schema({
  ownerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  size: {
    type: String,
    required: true,
  },
  pricePerMonth: {
    type: Number,
    required: true,
  },
  images: [
    {
      type: String,
    },
  ],
  availability: {
    type: String,
    enum: ["available", "booked", "maintenance"],
    default: "available",
  },
  location: {
    type: {
      type: String,
      enum: ["Point"],
      required: true,
    },
    coordinates: {
      type: [Number],
      required: true,
    },
    formattedAddress: {
      type: String,
      trim: true,
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

warehouseSchema.index({ location: "2dsphere" });

const Warehouse = mongoose.model("Warehouse", warehouseSchema);
module.exports = Warehouse;
