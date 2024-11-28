const Warehouse = require("../models/Warehouse");

const addWarehouse = async (req, res) => {
  const {
    ownerId,
    name,
    size,
    pricePerMonth,
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
      pricePerMonth,
      availability,
      images: [imageUrl],
      location: {
        type: location.type,
        coordinates: [latitude, longitude],
        formattedAddress: location.formattedAddress,
        city: location.city,
        state: location.state,
        country: location.country,
      },
    });

    await warehouse.save();

    res.status(201).json({
      message: "Warehouse listed successfully.",
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
    }).populate("ownerId");

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

module.exports = {
  addWarehouse,
  getAllWarehouses,
  getMyListings,
};
