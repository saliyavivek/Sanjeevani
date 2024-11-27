require("dotenv").config();

const express = require("express");
const db = require("./db/db");
const userRouter = require("./routes/userRoutes");
const warehouseRouter = require("./routes/warehouseRoutes");
const cors = require("cors");
const app = express();

db();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/users", userRouter);
app.use("/api/warehouses", warehouseRouter);

app.listen(PORT, () => {
  console.log(`Server is up and listening to port ${PORT}`);
});
