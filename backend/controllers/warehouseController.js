const Warehouse = require("../models/Warehouse");
const Notification = require("../models/Notification");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const Booking = require("../models/Booking");

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash-latest",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 500,
  responseMimeType: "text/plain",
};

const generateDescription = async (req, res) => {
  try {
    const { name, size, location } = req.body;
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const prompt = `Write a detailed and professional warehouse listing for the following:
Warehouse Name: ${name}
Size: ${size} sq ft
Location: ${location}
The description should be engaging, detailed, and attract potential tenants. Avoid using section titles, bullet points, or numbered lists. Focus on creating a narrative that flows smoothly and presents the warehouse's features in a cohesive manner.`;

    const result = await chatSession.sendMessage(prompt);

    if (result?.response?.text) {
      let description = result.response.text();
      // console.log(description);

      res.status(200).json({ description });
      return;
    } else {
      throw new Error("No response text generated.");
    }
  } catch (error) {
    console.error("Error during AI generation:", error.message);
    return "An error occurred while generating the description.";
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

// const getAllWarehouses = async (req, res) => {
//   try {
//     const warehouses = await Warehouse.find({}).populate("ownerId");
//     console.log(warehouses[0].bookings);

//     if (warehouses.length > 0) {
//       return res.status(201).send({ warehouses });
//     } else {
//       return res.status(500).send({ message: "No warehouses found." });
//     }
//   } catch (error) {
//     console.log(error);
//     return res.status(500).json({ message: error });
//   }
// };

const getAllWarehouses = async (req, res) => {
  try {
    const warehouses = await Warehouse.find({}).populate("ownerId");

    if (warehouses.length > 0) {
      const updatePromises = warehouses.map(async (warehouse) => {
        const bookings = await Booking.find({
          _id: { $in: warehouse.bookings },
        });

        // Check if all bookings are completed
        const allBookingsCompleted = bookings.every(
          (booking) => booking.status === "completed"
        );

        if (allBookingsCompleted && warehouse.availability !== "available") {
          warehouse.availability = "available";
          return warehouse.save(); // Save the updated warehouse
        } else if (
          !allBookingsCompleted &&
          warehouse.availability !== "booked"
        ) {
          warehouse.availability = "booked"; // Ensure availability reflects reality
          return warehouse.save();
        }

        return null; // No changes needed
      });

      // Wait for all save operations to complete
      await Promise.all(updatePromises);

      // Fetch updated warehouses to send in response
      const updatedWarehouses = await Warehouse.find({}).populate("ownerId");

      return res.status(201).send({
        message: "Warehouses updated successfully.",
        warehouses: updatedWarehouses,
      });
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

const uploadImage = async (req, res) => {
  try {
    // console.log(req);

    const { id } = req.params;
    // const imageUrl = req.file ? req.file.path : null;

    const warehouse = await Warehouse.findById(id);

    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    if (req.files) {
      req.files.forEach((file) => {
        warehouse.images.push(file.path);
      });
    }

    await warehouse.save();
    res.status(200).json({ message: "Image uploaded successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error uploading image", error });
  }
};

const deleteWarehouseImage = async (req, res) => {
  try {
    const { id, index } = req.params;

    const warehouse = await Warehouse.findById(id);
    if (!warehouse) {
      return res.status(404).json({ message: "Warehouse not found" });
    }

    await warehouse.images.splice(index, 1);
    await warehouse.save();
    res.status(200).json({ message: "Image deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error uploading image", error });
  }
};

const totalWarehouses = async (req, res) => {
  try {
    const totalWarehouses = await Warehouse.countDocuments();
    res.status(200).json({ totalWarehouses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch total warehouses" });
  }
};

const fetchAllWarehouses = async (req, res) => {
  try {
    const allWarehouses = await Warehouse.find({});

    res.status(200).json({ allWarehouses });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch all warehouses" });
  }
};

module.exports = {
  addWarehouse,
  getAllWarehouses,
  getMyListings,
  editWarehouse,
  deleteWarehouse,
  generateDescription,
  uploadImage,
  deleteWarehouseImage,
  totalWarehouses,
  fetchAllWarehouses,
};
