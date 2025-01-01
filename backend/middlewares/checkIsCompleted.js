const Booking = require("../models/Booking");
const Warehouse = require("../models/Warehouse");

const normalizeDate = (date) => {
  const normalizedDate = new Date(date);
  normalizedDate.setHours(0, 0, 0, 0);
  return normalizedDate;
};

const checkIsCompleted = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ status: "active" });
    if (!bookings)
      return res.status(404).json({ message: "Bookings not found." });

    // const currentDate = new Date();
    for (const booking of bookings) {
      if (normalizeDate(booking.endDate) < normalizeDate(new Date())) {
        const warehouse = await Warehouse.findById(booking.warehouseId);
        if (warehouse && warehouse.availability !== "available") {
          //   console.log(warehouse.name);
          warehouse.availability = "available";
          booking.status = "completed";
          await warehouse.save();
          await booking.save();
          //   console.log(`warehouse ${warehouse.name} marked available`);
        }
      }
    }
    next();
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { checkIsCompleted };
