const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: parseInt(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

/**
 * Send an email notification.
 * Fails silently if email is not configured — logs the error but doesn't crash the app.
 */
const sendEmail = async (to, subject, html) => {
    // Skip if email credentials are not configured
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        console.log(`📧 Email skipped (not configured): ${subject} → ${to}`);
        return;
    }

    try {
        await transporter.sendMail({
            from: `"Sahara Healthcare" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`📧 Email sent: ${subject} → ${to}`);
    } catch (error) {
        console.error("❌ Email sending failed:", error.message);
    }
};

const sendReportUploadedEmail = (patientEmail, patientName, reportType) => {
    return sendEmail(
        patientEmail,
        "New Medical Report Uploaded — Sahara Healthcare",
        `<div style="font-family: 'Segoe UI', sans-serif; max-width: 520px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #5BA4E6; margin-bottom: 8px;">📋 New Report Available</h2>
            <p>Hello <strong>${patientName}</strong>,</p>
            <p>A new <strong>${reportType}</strong> report has been uploaded to your account. You can log in to view and download it.</p>
            <a href="http://localhost:5173/login" style="display: inline-block; margin-top: 16px; padding: 10px 24px; background: #5BA4E6; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">View Report</a>
            <p style="margin-top: 24px; font-size: 12px; color: #9ca3af;">— Sahara Healthcare Team</p>
        </div>`
    );
};

const sendPrescriptionAddedEmail = (patientEmail, patientName, doctorName) => {
    return sendEmail(
        patientEmail,
        "New Prescription Added — Sahara Healthcare",
        `<div style="font-family: 'Segoe UI', sans-serif; max-width: 520px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #5BA4E6; margin-bottom: 8px;">💊 New Prescription</h2>
            <p>Hello <strong>${patientName}</strong>,</p>
            <p>Dr. <strong>${doctorName}</strong> has added a new prescription for you. Log in to view details and download the PDF.</p>
            <a href="http://localhost:5173/login" style="display: inline-block; margin-top: 16px; padding: 10px 24px; background: #5BA4E6; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">View Prescription</a>
            <p style="margin-top: 24px; font-size: 12px; color: #9ca3af;">— Sahara Healthcare Team</p>
        </div>`
    );
};

const sendAppointmentConfirmedEmail = (patientEmail, patientName, doctorName, date, timeSlot) => {
    return sendEmail(
        patientEmail,
        "Appointment Confirmed — Sahara Healthcare",
        `<div style="font-family: 'Segoe UI', sans-serif; max-width: 520px; margin: auto; padding: 30px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <h2 style="color: #5BA4E6; margin-bottom: 8px;">✅ Appointment Confirmed</h2>
            <p>Hello <strong>${patientName}</strong>,</p>
            <p>Your appointment with Dr. <strong>${doctorName}</strong> has been confirmed.</p>
            <p><strong>Date:</strong> ${new Date(date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}<br>
            <strong>Time:</strong> ${timeSlot}</p>
            <a href="http://localhost:5173/login" style="display: inline-block; margin-top: 16px; padding: 10px 24px; background: #5BA4E6; color: #fff; text-decoration: none; border-radius: 8px; font-weight: 600;">View Appointment</a>
            <p style="margin-top: 24px; font-size: 12px; color: #9ca3af;">— Sahara Healthcare Team</p>
        </div>`
    );
};

module.exports = {
    sendEmail,
    sendReportUploadedEmail,
    sendPrescriptionAddedEmail,
    sendAppointmentConfirmedEmail,
};
