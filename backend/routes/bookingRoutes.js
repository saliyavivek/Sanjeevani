const express = require("express");
const {
  createBooking,
  getUserBookings,
  cancelBooking,
  getBookingDetails,
  confirmBooking,
} = require("../controllers/bookingController");
const router = express.Router();

router.get("/:bookingId", getBookingDetails);
router.post("/", createBooking);
router.post("/getall", getUserBookings);
router.delete("/:bookingId", cancelBooking);
router.put("/:bookingId", confirmBooking);

module.exports = router;
