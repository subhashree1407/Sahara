const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
    createPrescription,
    getMyPrescriptions,
    getPatientPrescriptions,
    downloadPrescriptionPdf,
} = require("../controllers/prescriptionController");

// Doctor creates a prescription
router.post("/", protect, authorize("doctor"), createPrescription);

// Doctor fetches their written prescriptions
router.get("/doctor", protect, authorize("doctor"), getMyPrescriptions);

// Patient fetches their prescriptions
router.get("/patient", protect, authorize("patient"), getPatientPrescriptions);

// Download prescription as PDF (patient or doctor)
router.get(
    "/:id/pdf",
    protect,
    authorize("patient", "doctor"),
    downloadPrescriptionPdf
);

module.exports = router;
