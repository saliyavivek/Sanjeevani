const express = require("express");
const {
  addWarehouse,
  getAllWarehouses,
} = require("../controllers/warehouseController");
const router = express.Router();
const upload = require("../middlewares/multer");

router.get("/", getAllWarehouses);
router.post("/add", upload.single("image"), addWarehouse);

module.exports = router;
