const Appointment = require("../models/appointment.model");
const Doctor = require("../models/doctor.model");
const { sendAppointmentConfirmedEmail } = require("../utils/emailService");

// @desc    Book an appointment
// @access  Patient
const bookAppointment = async (req, res) => {
    try {
        const { doctorId, date, timeSlot, reason } = req.body;

        const doctor = await Doctor.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }

        const appointment = new Appointment({
            patient: req.user.id,
            doctor: doctorId,
            date,
            timeSlot,
            reason,
        });

        await appointment.save();

        res.status(201).json({ message: "Appointment booked successfully", appointment });
    } catch (error) {
        console.error("Error booking appointment:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get my appointments (patient or doctor)
// @access  Patient, Doctor
const getMyAppointments = async (req, res) => {
    try {
        const filter =
            req.user.role === "doctor"
                ? { doctor: req.user.id }
                : { patient: req.user.id };

        const appointments = await Appointment.find(filter)
            .populate("patient", "name email")
            .populate("doctor", "name email")
            .sort({ date: -1 });

        res.json(appointments);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Update appointment status (confirm, complete, cancel)
// @access  Doctor
const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const appointment = await Appointment.findById(req.params.id)
            .populate("patient", "name email")
            .populate("doctor", "name");

        if (!appointment) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        if (appointment.doctor._id.toString() !== req.user.id) {
            return res.status(403).json({ message: "Access denied" });
        }

        appointment.status = status;
        await appointment.save();

        // Send email if confirmed
        if (status === "confirmed") {
            sendAppointmentConfirmedEmail(
                appointment.patient.email,
                appointment.patient.name,
                appointment.doctor.name,
                appointment.date,
                appointment.timeSlot
            );
        }

        res.json({ message: `Appointment ${status}`, appointment });
    } catch (error) {
        console.error("Error updating appointment:", error);
        res.status(500).json({ message: "Server error" });
    }
};

// @desc    Get all doctors (for booking dropdown)
// @access  Patient
const getAllDoctors = async (req, res) => {
    try {
        const doctors = await Doctor.find().select("name email _id");
        res.json(doctors);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = {
    bookAppointment,
    getMyAppointments,
    updateAppointmentStatus,
    getAllDoctors,
};
