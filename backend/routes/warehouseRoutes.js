const express = require("express");
const {
  addWarehouse,
  getMyListings,
  getAllWarehouses,
  generateDescription,
  editWarehouse,
  deleteWarehouse,
} = require("../controllers/warehouseController");
const router = express.Router();
const upload = require("../middlewares/multer");
const { checkIsCompleted } = require("../middlewares/checkIsCompleted");

router.get("/", checkIsCompleted, getAllWarehouses);
router.post("/add", upload.single("image"), addWarehouse);
router.put("/edit", upload.single("image"), editWarehouse);
router.delete("/delete", deleteWarehouse);
router.post("/listings", getMyListings);
router.post("/generate-description", generateDescription);

module.exports = router;
