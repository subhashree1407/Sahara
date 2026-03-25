const Prescription = require("../models/prescription.model");
const Patient = require("../models/patient.model");
const Doctor = require("../models/doctor.model");
const { generatePrescriptionPdf } = require("../utils/pdfGenerator");
const { sendPrescriptionAddedEmail } = require("../utils/emailService");

// @desc    Create a prescription
// @access  Doctor
const createPrescription = async (req, res) => {
    try {
        const { patientId, reportId, diagnosis, medicines, notes } = req.body;

        const patient = await Patient.findById(patientId);
        if (!patient) {
            return res.status(404).json({ message: "Patient not found" });
        }

        const doctor = await Doctor.findById(req.user.id);

        const prescription = new Prescription({
            patient: patientId,
            doctor: req.user.id,
            report: reportId || undefined,
            diagnosis,
            medicines,
            notes,
        });

        await prescription.save();

        // Send email notification
        sendPrescriptionAddedEmail(patient.email, patient.name, doctor.name);

        res.status(201).json({ message: "Prescription created successfully", prescription });
    } catch (error) {
        console.error("Error creating prescription:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get prescriptions written by the logged-in doctor
// @access  Doctor
const getMyPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ doctor: req.user.id })
            .populate("patient", "name email")
            .populate("report", "reportType")
            .sort({ createdAt: -1 });
        res.json(prescriptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get prescriptions for the logged-in patient
// @access  Patient
const getPatientPrescriptions = async (req, res) => {
    try {
        const prescriptions = await Prescription.find({ patient: req.user.id })
            .populate("doctor", "name")
            .populate("report", "reportType")
            .sort({ createdAt: -1 });
        res.json(prescriptions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Download prescription as PDF
// @access  Patient, Doctor
const downloadPrescriptionPdf = async (req, res) => {
    try {
        const prescription = await Prescription.findById(req.params.id)
            .populate("patient", "name email")
            .populate("doctor", "name");

        if (!prescription) {
            return res.status(404).json({ message: "Prescription not found" });
        }

        // Only allow the patient or the doctor who wrote it
        if (
            prescription.patient._id.toString() !== req.user.id &&
            prescription.doctor._id.toString() !== req.user.id
        ) {
            return res.status(403).json({ message: "Access denied" });
        }

        generatePrescriptionPdf(prescription, res);
    } catch (error) {
        console.error("Error generating PDF:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    createPrescription,
    getMyPrescriptions,
    getPatientPrescriptions,
    downloadPrescriptionPdf,
};
