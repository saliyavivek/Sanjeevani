const express = require("express");
const {
  createBooking,
  getUserBookings,
  cancelBooking,
  getBookingDetails,
  confirmBooking,
  isBookedByUser,
  getAllBookings,
  fetchAdminEarnings,
  getBookingRequests,
  handleRequest,
  pendingPayments,
  // markCompleted,
} = require("../controllers/bookingController");
const router = express.Router();

router.get("/all-bookings", getAllBookings);
router.get("/commission", fetchAdminEarnings);
router.get("/:bookingId", getBookingDetails);
router.post("/", createBooking);
router.post("/getall", getUserBookings);
router.delete("/:bookingId", cancelBooking);
router.put("/:bookingId", confirmBooking);
router.post("/isBookedByUser", isBookedByUser);
router.post("/booking-requests", getBookingRequests);
router.put("/booking-requests/:bookingId", handleRequest);
router.get("/pending-payments/:userId", pendingPayments);
// router.post("/completed", markCompleted);

module.exports = router;
