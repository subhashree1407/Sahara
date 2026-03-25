const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const {
    bookAppointment,
    getMyAppointments,
    updateAppointmentStatus,
    getAllDoctors,
} = require("../controllers/appointmentController");

// Patient books an appointment
router.post("/", protect, authorize("patient"), bookAppointment);

// Patient or Doctor fetches their appointments
router.get("/my", protect, authorize("patient", "doctor"), getMyAppointments);

// Doctor updates appointment status
router.patch("/:id/status", protect, authorize("doctor"), updateAppointmentStatus);

// Patient gets list of all doctors (for booking)
router.get("/doctors", protect, authorize("patient"), getAllDoctors);

module.exports = router;
