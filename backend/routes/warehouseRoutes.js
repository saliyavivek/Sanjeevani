const express = require("express");
const {
  addWarehouse,
  getAllWarehouses,
  getMyListings,
  editWarehouse,
  deleteWarehouse,
} = require("../controllers/warehouseController");
const router = express.Router();
const upload = require("../middlewares/multer");

router.get("/", getAllWarehouses);
router.post("/add", upload.single("image"), addWarehouse);
router.put("/edit", upload.single("image"), editWarehouse);
router.delete("/delete", deleteWarehouse);
router.post("/listings", getMyListings);

module.exports = router;
