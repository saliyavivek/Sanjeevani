const Warehouse = require("../models/Warehouse");
const Notification = require("../models/Notification");
const axios = require("axios");
// const OpenAI = require("openai");

// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

const generateDescription = async (req, res) => {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  const { name, size, location } = req.body;

  try {
    const response = await axios.post(
      "https://api-inference.huggingface.co/models/EleutherAI/gpt-neo-1.3B",
      {
        inputs: `Write a detailed, professional warehouse listing for the following:

        Warehouse Name: ${name}  
        Size: ${size} sq ft  
        Location: ${location}

        The description should include:
        - Unique location advantages
        - Key features of the warehouse (size, layout, design)
        - Security features
        - Accessibility for logistics
        - Suitable business uses

        Make sure the description is between 300-500 words and flows naturally. Focus on creating a compelling and informative narrative that highlights the key selling points.
        `,
        parameters: { max_new_tokens: 300, temperature: 0.5, top_p: 0.9 },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response);

    let description = response.data[0].generated_text.trim();
    description = description
      .split("\n")
      .filter((line) => line.length > 0)
      .join("\n\n");

    res.status(200).json({ description });
  } catch (error) {
    console.error(
      "Error generating description:",
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ message: "Error generating description" });
  }
};

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
    })
      .populate("ownerId")
      .populate({
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
  generateDescription,
};
