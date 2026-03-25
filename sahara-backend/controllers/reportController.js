const Report = require("../models/report.model");
const Patient = require("../models/patient.model");
const multer = require("multer");
const path = require("path");
const { sendReportUploadedEmail } = require("../utils/emailService");

// Multer config
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, "uploads/"),
    filename: (req, file, cb) => {
        const unique = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, unique + path.extname(file.originalname));
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
    fileFilter: (req, file, cb) => {
        const allowed = /pdf|jpg|jpeg|png/;
        const ext = allowed.test(path.extname(file.originalname).toLowerCase());
        const mime = allowed.test(file.mimetype);
        if (ext && mime) return cb(null, true);
        cb(new Error("Only PDF, JPG, and PNG files are allowed"));
    },
});

// @desc    Upload a report for a patient
// @access  Lab technician
const uploadReport = async (req, res) => {
    try {
        const { patientId, reportType, notes } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Report file is required" });
        }

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        const report = new Report({
            patient: patientId,
            uploadedBy: req.user.id,
            uploadedByType: req.user.role === 'doctor' ? 'Doctor' : 'Lab',
            reportType,
            fileUrl: req.file.filename,
            notes,
        });

        await report.save();

        // Send email notification
        sendReportUploadedEmail(patient.email, patient.name, reportType);

        res.status(201).json({ message: "Report uploaded successfully", report });
    } catch (error) {
        console.error("Error uploading report:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get reports uploaded by the logged-in lab tech
// @access  Lab
const getMyUploads = async (req, res) => {
    try {
        const reports = await Report.find({ uploadedBy: req.user.id })
            .populate("patient", "name email")
            .sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get reports for a specific patient
// @access  Doctor, Lab, Patient (own)
const getReportsForPatient = async (req, res) => {
    try {
        const { patientId } = req.params;
        const reports = await Report.find({ patient: patientId })
            .populate("uploadedBy", "name")
            .sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get my own reports (patient)
// @access  Patient
const getMyReports = async (req, res) => {
    try {
        const reports = await Report.find({ patient: req.user.id })
            .populate("uploadedBy", "name")
            .sort({ createdAt: -1 });
        res.json(reports);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get all patients (for lab dropdown)
// @access  Lab, Doctor
const getAllPatients = async (req, res) => {
    try {
        const patients = await Patient.find().select("name email _id");
        res.json(patients);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    upload,
    uploadReport,
    getMyUploads,
    getReportsForPatient,
    getMyReports,
    getAllPatients,
};
