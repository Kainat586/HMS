// src/scripts/migrateData.js
const mongoose = require("mongoose");
const Patient = require("../models/Patient.js"); // adjust path if needed
const User = require("../models/User.jsx");       // adjust path if needed

async function connectDB() {
  await mongoose.connect("mongodb://127.0.0.1:27017/hms", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("✅ MongoDB connected");
}

async function migrate() {
  await connectDB();

  const patients = await Patient.find({});
  console.log(`Found ${patients.length} patients`);

  for (const patient of patients) {
    const newUser = new User({
      _id: patient._id, // reuse same _id if you want
      name: patient.name,
      email: patient.email,
      disease: patient.disease,
      role: "patient",
    });

    await newUser.save();
    console.log(`Migrated: ${patient.name}`);
  }

  console.log("🎉 Migration completed");
  process.exit();
}

migrate().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
