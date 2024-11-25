const mongoose = require("mongoose");

async function main() {
  await mongoose
    .connect(process.env.MONGO_URL)
    .then(() => console.log("connected to databse"))
    .catch(() => console.log("error while connecting to database"));
}

module.exports = main;
