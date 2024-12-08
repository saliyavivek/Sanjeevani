const Booking = require("../models/Booking");
const Warehouse = require("../models/Warehouse");

const createBooking = async (req, res) => {
  try {
    const { warehouseId, userId, startDate, endDate, totalPrice } = req.body;

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
      totalPrice,
    });

    await booking.save();

    // warehouse.availability = "booked";
    warehouse.bookings.push(booking._id);
    await warehouse.save();

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.body.userId }).populate({
      path: "warehouseId",
      populate: {
        path: "ownerId",
      },
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
    await warehouse.save();

    await booking.deleteOne();
    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getBookingDetails = async (req, res) => {
  try {
    // console.log("inside get details");
    const booking = await Booking.findById(req.params.bookingId).populate({
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
    // console.log(req.body.warehouseId);

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

    return res
      .status(200)
      .json({ message: "Booking is updated and is now active.", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const isBookedByUser = async (req, res) => {
  // console.log(req.body.userId);

  const booking = await Booking.findOne({
    userId: req.body.userId,
    warehouseId: req.body.warehouseId,
  });
  if (!booking) {
    return res.status(404).json({ message: false });
  }
  // console.log(booking);
  return res.status(201).json({ message: true });
};

const markCompleted = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    const warehouse = await Warehouse.findById(req.body.warehouseId);
    if (!warehouse)
      return res.status(404).json({ message: "Booked warehouse not found" });

    warehouse.availability === "available";
    await warehouse.save();

    booking.status = "completed";
    await booking.save();

    console.log(booking);

    res
      .status(200)
      .json({
        message: "Booking completed and warehouse is now available to book",
      });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  cancelBooking,
  getBookingDetails,
  confirmBooking,
  isBookedByUser,
  markCompleted,
};
