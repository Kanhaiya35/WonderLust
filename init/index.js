const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wonderlust";

async function main() {
  await mongoose.connect(MONGO_URL);
}
main().then(() => console.log("connected to DB")).catch(console.log);

const initDB = async () => {
  await Listing.deleteMany({});

  const OWNER_ID = "69109811194b0c8eaa315654";  // <-- your fixed owner ID

  const listingsWithOwner = initData.data.map((obj) => ({
    ...obj,
    owner: OWNER_ID,
  }));

  await Listing.insertMany(listingsWithOwner);

  console.log("Data initialized with owner!");
};

initDB();
