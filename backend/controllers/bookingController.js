const Booking = require("../models/Booking");
const Notification = require("../models/Notification");
const Warehouse = require("../models/Warehouse");
const User = require("../models/User");
const { formatDate } = require("../utils/formatDate");

const createBooking = async (req, res) => {
  try {
    const {
      warehouseId,
      ownerId,
      userName,
      userId,
      startDate,
      endDate,
      basePrice,
      commissionFee,
    } = req.body;

    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse)
      return res.status(404).json({ message: "Warehouse not found" });

    if (warehouse.availability !== "available") {
      return res.status(400).json({ message: "Warehouse is not available" });
    }

    // const totalPrice =
    //   warehouse.pricePerDay *
    //   ((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24 * 30));

    const booking = new Booking({
      warehouseId,
      userId,
      startDate,
      endDate,
      totalPrice: basePrice,
      commission: commissionFee,
      ownerEarnings: basePrice - commissionFee,
      status: "pending",
      approvalStatus: "pending",
    });

    await booking.save();

    // warehouse.availability = "booked";
    warehouse.bookings.push(booking._id);
    await warehouse.save();

    const startDateFormatted = formatDate(booking.startDate);
    const endDateFormatted = formatDate(booking.endDate);

    //old code

    // await Notification.create({
    //   userId,
    //   content: `Your booking request for ${warehouse.name} from ${startDateFormatted} to ${endDateFormatted} has been submitted. Please complete the payment to confirm your booking.`,
    //   type: "booking",
    // });

    //added after guide's suggestion
    await Notification.create({
      userId,
      content: `Your booking request for ${warehouse.name} has been submitted and is awaiting owner approval. You will be notified once the owner reviews your request.`,
      type: "request",
    }); // notification for farmer

    await Notification.create({
      userId: ownerId,
      content: `You have received a new booking request for ${warehouse.name} from ${userName}. Please review the request and confirm or decline the booking.`,
      type: "request",
    }); // notification for owner

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const normalizeDate = (date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
};

const getUserBookings = async (req, res) => {
  try {
    let filter = { userId: req.body.userId };

    if (!req.body.isFetchAll) {
      filter.status = { $ne: "declined" };
    }

    const bookings = await Booking.find(filter)
      .populate({
        path: "warehouseId",
        populate: {
          path: "ownerId",
        },
      })
      .sort({ startDate: 1 });

    const currentDate = normalizeDate(new Date());
    bookings.forEach(async (booking) => {
      if (normalizeDate(booking.endDate) < currentDate) {
        booking.status = "completed";
        await booking.save();
      }
    });

    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const warehouse = await Warehouse.findById(booking.warehouseId);
    warehouse.availability = "available";
    warehouse.bookings = warehouse.bookings.filter(
      (bId) => bId.toString() !== req.params.bookingId
    );
    await Warehouse.findByIdAndUpdate(booking.warehouseId, {
      $pull: { pendingRequests: booking._id },
    });
    await warehouse.save();

    const user = await User.findById(req.body.userId);

    await booking.deleteOne();

    const startDateFormatted = formatDate(booking.startDate);
    const endDateFormatted = formatDate(booking.endDate);

    await Notification.create({
      userId: req.body.userId,
      content: `Your booking at ${warehouse.name} from ${startDateFormatted} to ${endDateFormatted} has been canceled.`,
      type: "booking",
    });

    await Notification.create({
      userId: warehouse.ownerId,
      content: `Oops, the booking was canceled for ${warehouse.name} by ${user.name}. Don't worry! Keep the warehouse ready for future bookings!`,
      type: "cancel",
    });

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getBookingDetails = async (req, res) => {
  try {
    // console.log("inside get details");
    const booking = await Booking.findById(req.params.bookingId)
      .populate("userId")
      .populate({
        path: "warehouseId",
        populate: {
          path: "ownerId",
        },
      });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    // console.log(booking);

    return res.status(200).json(booking);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const confirmBooking = async (req, res) => {
  try {
    // console.log(req.body);
    const pendingBooking = await Booking.find({
      warehouseId: req.body.warehouseId,
      status: "pending",
      userId: { $ne: req.body.userId },
    });
    // console.log(pendingBooking);

    if (pendingBooking.length > 0) {
      await Booking.deleteMany({
        _id: { $in: pendingBooking.map((booking) => booking._id) },
      });
    }

    const warehouse = await Warehouse.findById(req.body.warehouseId);
    warehouse.bookings = warehouse.bookings.filter(
      (bookingId) =>
        !pendingBooking
          .map((booking) => booking._id.toString())
          .includes(bookingId.toString())
    );
    await warehouse.save();

    const booking = await Booking.findByIdAndUpdate(
      req.params.bookingId,
      {
        status: "active",
      },
      {
        new: true,
      }
    )
      .populate("userId") // Populate userId
      .populate({
        path: "warehouseId", // Populate warehouseId
        populate: {
          path: "ownerId", // Populate warehouseId->ownerId
        },
      });
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    // console.log(booking);
    await Warehouse.findByIdAndUpdate(
      req.body.warehouseId,
      {
        availability: "booked",
      },
      {
        new: true,
      }
    );
    // console.log(warehouse);

    const startDateFormatted = formatDate(booking.startDate);
    const endDateFormatted = formatDate(booking.endDate);

    await Notification.create({
      userId: req.body.userId,
      content: `Your payment for the booking at ${warehouse.name} from ${startDateFormatted} to ${endDateFormatted} has been successfully processed. Your booking is now confirmed.`,
      type: "booking",
    });

    await Notification.create({
      userId: warehouse.ownerId,
      content: `Your warehouse ${warehouse.name} has been booked by ${booking.userId.name} from ${startDateFormatted} to ${endDateFormatted}.`,
      type: "celebration",
    });

    // console.log(booking);

    return res
      .status(200)
      .json({ message: "Booking is updated and is now active.", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// const fetchSingleBookingForInvoice = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.bookingId)
//       .populate("userId")
//       .populate({
//         path: "warehouseId",
//         populate: {
//           path: "ownerId",
//         },
//       });
//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     return res.status(200).json(booking);
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

const isBookedByUser = async (req, res) => {
  // console.log(req.body.userId);

  const booking = await Booking.findOne({
    userId: req.body.userId,
    warehouseId: req.body.warehouseId,
    approvalStatus: "approved",
  });

  // console.log(booking);
  if (!booking) {
    return res.status(201).json({ message: false });
  }
  // console.log(booking);
  return res.status(201).json({ message: true });
};

// const markCompleted = async (req, res) => {
//   try {
//     const booking = await Booking.findById(req.params.bookingId);
//     if (!booking) return res.status(404).json({ message: "Booking not found" });

//     const warehouse = await Warehouse.findById(req.body.warehouseId);
//     if (!warehouse)
//       return res.status(404).json({ message: "Booked warehouse not found" });

//     warehouse.availability === "available";
//     await warehouse.save();

//     booking.status = "completed";
//     await booking.save();

//     console.log(booking);

//     res.status(200).json({
//       message: "Booking completed and warehouse is now available to book",
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error });
//   }
// };

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate({
        path: "warehouseId", // Populate warehouseId
        populate: {
          path: "ownerId", // Populate warehouseId->ownerId
        },
      })
      .populate("userId");

    if (bookings.length === 0) {
      return res.status(404).json({ message: "no bookings found" });
    }
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const fetchAdminEarnings = async (req, res) => {
  try {
    const bookings = await Booking.find({});
    let totalCommission = 0;

    if (bookings.length === 0) {
      return res.status(404).json({ message: "no bookings found" });
    }

    bookings.forEach((booking) => {
      if (booking.commission) {
        totalCommission += booking.commission;
      }
    });

    res.status(200).json({ totalCommission });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getBookingRequests = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res
        .status(400)
        .json({ message: "Please provide a valid user id." });
    }

    const ownerWarehouses = await Warehouse.find({ ownerId: userId }).select(
      "_id"
    );

    if (!ownerWarehouses) {
      return res
        .status(400)
        .json({ message: "No warehouses found for this user." });
    }

    const warehouseIds = ownerWarehouses.map((warehouse) => warehouse._id);

    const pendingBookings = await Booking.find({
      warehouseId: { $in: warehouseIds },
      approvalStatus: "pending",
    })
      .populate("warehouseId", "name location images") // Populate warehouse details
      .populate("userId", "name email avatar"); // Populate user details

    // console.log(pendingBookings);
    res.status(200).json({ bookings: pendingBookings });
  } catch (error) {
    console.error("Error fetching pending bookings:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const handleRequest = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { approvalStatus, userId } = req.body; // "approved" or "rejected"

    // console.log(bookingId, approvalStatus);

    const booking = await Booking.findById(bookingId).populate("warehouseId");
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (approvalStatus === "approved") {
      // booking.status = "active";
      booking.approvalStatus = "approved";

      await Notification.create({
        userId,
        content: `Great news! Your booking request has been approved for ${booking.warehouseId.name}. Please make a payment to proceed.`,
        type: "celebration",
      });
    } else {
      booking.status = "declined";
      booking.approvalStatus = "rejected";

      await Notification.create({
        userId,
        content: `Unfortunately, your booking request for ${booking.warehouseId.name} has been declined by the owner. You may explore other available storage options.`,
        type: "cancel",
      });
    }

    await booking.save();

    await Warehouse.findByIdAndUpdate(booking.warehouseId, {
      $pull: { pendingRequests: booking._id },
    });

    if (approvalStatus === "approved") {
      const otherPendingBookings = await Booking.find({
        warehouseId: booking.warehouseId._id,
        approvalStatus: "pending",
      }).populate("warehouseId");

      // console.log("Pending Bookings", otherPendingBookings);

      if (otherPendingBookings.length > 0) {
        await Booking.updateMany(
          { warehouseId: booking.warehouseId._id, approvalStatus: "pending" },
          { $set: { approvalStatus: "rejected", status: "declined" } }
        );

        const notifications = otherPendingBookings.map((pendingBooking) => ({
          userId: pendingBooking.userId,
          content: `Unfortunately, your booking request for ${pendingBooking.warehouseId.name} has been declined by the owner. You may explore other available storage options.`,
          type: "cancel",
        }));

        await Notification.insertMany(notifications);
      }
    }

    res.status(200).json({ message: `Booking ${approvalStatus}` });
  } catch (error) {
    res.status(500).json({ message: "Error updating booking status", error });
  }
};

const pendingPayments = async (req, res) => {
  try {
    const { userId } = req.params;

    const bookings = await Booking.find({
      userId,
      status: "pending",
      approvalStatus: "approved",
    });

    return res
      .status(200)
      .json({ message: "Pending Payments found.", bookings });
  } catch (error) {
    return res.status(500).json({ message: "Error finding pending payments." });
  }
};

module.exports = {
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
};
