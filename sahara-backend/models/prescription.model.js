const mongoose = require("mongoose");

const medicineSchema = new mongoose.Schema(
    {
        name: { type: String, required: true, trim: true },
        dosage: { type: String, required: true, trim: true },
        duration: { type: String, required: true, trim: true },
        instructions: { type: String, trim: true },
    },
    { _id: false }
);

const prescriptionSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        doctor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Doctor",
            required: true,
        },
        report: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Report",
        },
        diagnosis: {
            type: String,
            required: true,
            trim: true,
        },
        medicines: {
            type: [medicineSchema],
            required: true,
            validate: [(arr) => arr.length > 0, "At least one medicine is required"],
        },
        notes: {
            type: String,
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Prescription", prescriptionSchema);
