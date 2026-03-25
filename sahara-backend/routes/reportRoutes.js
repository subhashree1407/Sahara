const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
    upload,
    uploadReport,
    getMyUploads,
    getReportsForPatient,
    getMyReports,
    getAllPatients,
} = require("../controllers/reportController");

// Lab uploads a report
router.post(
    "/upload",
    protect,
    authorize("lab"),
    upload.single("reportFile"),
    uploadReport
);

// Lab fetches their uploads
router.get("/my-uploads", protect, authorize("lab"), getMyUploads);

// Patient fetches own reports
router.get("/my-reports", protect, authorize("patient"), getMyReports);

// Doctor or Lab fetches reports for a specific patient
router.get(
    "/patient/:patientId",
    protect,
    authorize("doctor", "lab"),
    getReportsForPatient
);

// Lab or Doctor gets all patients list
router.get("/patients", protect, authorize("lab", "doctor"), getAllPatients);

module.exports = router;
