require("dotenv").config();

const express = require("express");
const { connectDB } = require("./db/db");
const userRouter = require("./routes/userRoutes");
const warehouseRouter = require("./routes/warehouseRoutes");
const bookingRouter = require("./routes/bookingRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const notificationRouter = require("./routes/notificationRoutes");
const wishlistRouter = require("./routes/wishlistRoutes");
const authRouter = require("./routes/authRoutes");
const cors = require("cors");
const app = express();

connectDB();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`Request from: ${req.ip}`);
  next();
});

app.use("/api/users", userRouter);
app.use("/api/warehouses", warehouseRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/notifications", notificationRouter);
app.use("/api/wishlists", wishlistRouter);
app.use("/api/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server is up and listening to port ${PORT}`);
});
