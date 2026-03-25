const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/admin.model");
const dotenv = require("dotenv");

dotenv.config();

async function checkAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, { dbName: "healthcareDB" });
    const admin = await Admin.findOne({ role: "admin" });
    if (admin) {
      console.log("Admin email found:", admin.email);
      // Let's reset the password to admin123
      const salt = await bcrypt.genSalt(10);
      admin.password = await bcrypt.hash("admin123", salt);
      await admin.save();
      console.log("Admin password reset to: admin123");
    } else {
      console.log("No admin found. Creating one...");
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash("admin123", salt);
      const newAdmin = new Admin({
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
      });
      await newAdmin.save();
      console.log("Created new admin with email admin@example.com and password admin123");
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkAdmin();
