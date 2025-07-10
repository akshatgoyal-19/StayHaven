require("dotenv").config(); // Always at the very top

const mongoose = require("mongoose");
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = process.env.ATLASDB_URL; //replace with url (then works)

async function main() {
  await mongoose.connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
}

main()
  .then(() => {
    console.log("✅ Connected to MongoDB");
    initDB(); // Only run init after DB is ready
  })
  .catch((err) => {
    console.error("❌ DB Connection Error:", err);
  });

const initDB = async () => {
  try {
    await Listing.deleteMany({});
    initdata.data = initdata.data.map((obj) => ({
      ...obj,
      owner: "6849d8948429d2921d68b5e0", // Replace with real user ID if needed
    }));
    await Listing.insertMany(initdata.data);
    console.log("✅ Sample listings inserted!");
  } catch (err) {
    console.error("❌ Error initializing DB:", err);
  } finally {
    mongoose.connection.close(); // 🔐 Optional: close connection when done
  }
};
