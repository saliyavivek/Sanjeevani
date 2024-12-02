const express = require("express");
const {
  createBooking,
  getUserBookings,
  cancelBooking,
} = require("../controllers/bookingController");
const router = express.Router();

router.post("/", createBooking);
router.post("/getall", getUserBookings);
router.delete("/:bookingId", cancelBooking);

module.exports = router;
