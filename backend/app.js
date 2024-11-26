require("dotenv").config();

const express = require("express");
const db = require("./db/db");
const userRouter = require("./routes/userRoutes");
const cors = require("cors");
const app = express();

db();
const PORT = process.env.PORT;

app.use(cors());
app.use(express.json());

app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server is up and listening to port ${PORT}`);
});
