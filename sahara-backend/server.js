const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");

// Load environment variables
dotenv.config();

const app = express();

// ------------------- MIDDLEWARE -------------------

app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
        exposedHeaders: ["Content-Disposition"],
    })
);
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ------------------- DATABASE CONNECTION -------------------

mongoose
    .connect(process.env.MONGO_URI, {
        dbName: "healthcareDB",
    })
    .then(() => {
        console.log("✅ MongoDB Connected to healthcareDB");
    })
    .catch((err) => {
        console.error("❌ MongoDB Connection Failed:", err.message);
    });

// ------------------- ROUTES -------------------

const authRoutes = require("./routes/authRoutes");
const setupRoutes = require("./routes/setupRoutes");
const adminRoutes = require("./routes/adminRoutes");
const reportRoutes = require("./routes/reportRoutes");
const prescriptionRoutes = require("./routes/prescriptionRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/setup", setupRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/prescriptions", prescriptionRoutes);
app.use("/api/appointments", appointmentRoutes);

// ------------------- BASIC ROUTE -------------------

app.get("/", (req, res) => {
    res.send("Healthcare Backend is Running 🚀");
});

// ------------------- 404 HANDLER -------------------

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

// ------------------- START SERVER -------------------

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});
