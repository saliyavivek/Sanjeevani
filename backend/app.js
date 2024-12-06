require("dotenv").config();

const express = require("express");
const db = require("./db/db");
const userRouter = require("./routes/userRoutes");
const warehouseRouter = require("./routes/warehouseRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const cors = require("cors");
const app = express();

db();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api/warehouses", warehouseRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/reviews", reviewRouter);

app.listen(PORT, () => {
  console.log(`Server is up and listening to port ${PORT}`);
});
