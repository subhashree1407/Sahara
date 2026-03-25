const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
    {
        patient: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Patient",
            required: true,
        },
        uploadedBy: {
            type: mongoose.Schema.Types.ObjectId,
            refPath: "uploadedByType",
            required: true,
        },
        uploadedByType: {
            type: String,
            required: true,
            enum: ["Doctor", "Lab"],
        },
        reportType: {
            type: String,
            required: true,
            trim: true,
        },
        fileUrl: {
            type: String,
            required: true,
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

module.exports = mongoose.model("Report", reportSchema);
