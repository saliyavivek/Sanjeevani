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

    warehouse.availability = "booked";
    warehouse.bookings.push(booking._id);
    await warehouse.save();

    res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.body.userId }).populate(
      "warehouseId"
    );
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

module.exports = { createBooking, getUserBookings, cancelBooking };
