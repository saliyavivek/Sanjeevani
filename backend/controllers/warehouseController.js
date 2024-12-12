const Warehouse = require("../models/Warehouse");
const Notification = require("../models/Notification");

const addWarehouse = async (req, res) => {
  const {
    ownerId,
    name,
    size,
    pricePerDay,
    description,
    availability,
    location,
    longitude,
    latitude,
  } = req.body;
  const imageUrl = req.file ? req.file.path : null;

  try {
    const warehouse = new Warehouse({
      ownerId,
      name,
      description,
      size,
      pricePerDay,
      availability,
      images: [imageUrl],
      location: {
        type: location.type,
        coordinates: [longitude, latitude],
        formattedAddress: location.formattedAddress,
        city: location.city,
        state: location.state,
        country: location.country,
      },
    });

    await warehouse.save();

    await Notification.create({
      userId: ownerId,
      content: `Your warehouse ${name} has been listed.`,
      type: "booking",
    });

    res.status(201).json({
      message: "Warehouse listed.",
      warehouse: warehouse,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

const getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find({}).populate("ownerId");

    if (warehouses.length > 0) {
      return res.status(201).send({ warehouses });
    } else {
      return res.status(500).send({ message: "No warehouses found." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

const getMyListings = async (req, res) => {
  try {
    const warehouses = await Warehouse.find({
      ownerId: req.body.user,
    }).populate({
      path: "ownerId",
      path: "bookings",
      populate: {
        path: "userId",
      },
    });

    if (warehouses.length > 0) {
      // console.log(warehouses);

      return res.status(201).send({ warehouses });
    } else {
      return res.status(500).send({ message: "No warehouses found." });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error });
  }
};

const editWarehouse = async (req, res) => {
  try {
    const {
      warehouseId,
      name,
      size,
      pricePerDay,
      description,
      availability,
      location,
      longitude,
      latitude,
    } = req.body;
    // console.log("longitude", longitude);
    // console.log("latitude", latitude);

    const warehouse = await Warehouse.findById(warehouseId);

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    warehouse.name = name || warehouse.name;
    warehouse.description = description || warehouse.description;
    warehouse.size = size || warehouse.size;
    warehouse.pricePerDay = pricePerDay || warehouse.pricePerDay;
    warehouse.availability = availability || warehouse.availability;
    warehouse.location.coordinates[0] =
      longitude || warehouse.location.coordinates[0];
    warehouse.location.coordinates[1] =
      latitude || warehouse.location.coordinates[1];

    Object.keys(location).forEach((key) => {
      if (location[key] !== undefined) {
        warehouse.location[key] = location[key];
      }
    });

    if (req.file) {
      warehouse.images[0] = req.file.path;
    }

    // Save updated warehouse
    await warehouse.save();

    await Notification.create({
      userId: warehouse.ownerId,
      content: `Some changes have been made to your listing ${warehouse.name}.`,
      type: "booking",
    });
    res.status(200).json({ message: "Warehouse updated." });
  } catch (error) {
    res.status(500).json({ message: "Error updating warehouse", error });
  }
};

const deleteWarehouse = async (req, res) => {
  try {
    const { warehouseId } = req.body;

    const warehouse = await Warehouse.findById(warehouseId);
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    await Warehouse.deleteOne({ _id: warehouseId });

    await Notification.create({
      userId: warehouse.ownerId,
      content: `Your listing for the warehouse ${warehouse.name} has been deleted.`,
      type: "booking",
    });
    res.status(200).json({ message: "Warehouse deleted." });
  } catch (error) {
    res.status(500).json({ message: "Error deleting warehouse", error });
  }
};

module.exports = {
  addWarehouse,
  getAllWarehouses,
  getMyListings,
  editWarehouse,
  deleteWarehouse,
};
