const PDFDocument = require("pdfkit");

/**
 * Generate a prescription PDF and pipe it to the response.
 */
const generatePrescriptionPdf = (prescription, res) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    // Set headers
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
        "Content-Disposition",
        `attachment; filename=prescription_${prescription._id}.pdf`
    );

    // Handle stream errors
    doc.on("error", (err) => {
        console.error("PDF generation error:", err);
    });

    doc.pipe(res);

    const blue = "#5BA4E6";
    const darkText = "#1f2937";
    const grayText = "#6b7280";

    // ── Header ──
    doc.fontSize(22).fillColor(blue).text("Sahara Healthcare", { align: "center" });
    doc.fontSize(10).fillColor(grayText).text("Digital Care Platform", { align: "center" });
    doc.moveDown(0.3);

    const lineY1 = doc.y;
    doc.moveTo(50, lineY1).lineTo(545, lineY1).strokeColor("#e5e7eb").lineWidth(1).stroke();
    doc.moveDown(1);

    // ── Prescription Title ──
    doc.fontSize(16).fillColor(darkText).text("Medical Prescription", { align: "center" });
    doc.moveDown(0.8);

    // ── Patient & Doctor Info ──
    const patientName = prescription.patient?.name || "N/A";
    const doctorName = prescription.doctor?.name || "N/A";
    const dateStr = new Date(prescription.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    doc.fontSize(10).fillColor(grayText).text("Patient: ", 50, doc.y, { continued: true });
    doc.fontSize(11).fillColor(darkText).text(patientName);

    doc.fontSize(10).fillColor(grayText).text("Doctor: ", 50, doc.y, { continued: true });
    doc.fontSize(11).fillColor(darkText).text("Dr. " + doctorName);

    doc.fontSize(10).fillColor(grayText).text("Date: ", 50, doc.y, { continued: true });
    doc.fontSize(11).fillColor(darkText).text(dateStr);

    doc.moveDown(1);

    const lineY2 = doc.y;
    doc.moveTo(50, lineY2).lineTo(545, lineY2).strokeColor("#e5e7eb").lineWidth(1).stroke();
    doc.moveDown(1);

    // ── Diagnosis ──
    doc.fontSize(12).fillColor(blue).text("Diagnosis");
    doc.moveDown(0.3);
    doc.fontSize(11).fillColor(darkText).text(prescription.diagnosis || "—");
    doc.moveDown(1);

    // ── Medicines ──
    doc.fontSize(12).fillColor(blue).text("Prescribed Medicines");
    doc.moveDown(0.5);

    const medicines = prescription.medicines || [];

    // Table header
    doc.fontSize(10).fillColor(grayText);
    doc.text("Medicine", 50, doc.y, { width: 150 });
    const headerY = doc.y - 12;
    doc.text("Dosage", 200, headerY, { width: 100 });
    doc.text("Duration", 300, headerY, { width: 100 });
    doc.text("Instructions", 400, headerY, { width: 145 });
    doc.moveDown(0.2);

    // Underline
    const lineY3 = doc.y;
    doc.moveTo(50, lineY3).lineTo(545, lineY3).strokeColor("#d1d5db").lineWidth(0.5).stroke();
    doc.moveDown(0.3);

    // Table rows
    medicines.forEach((med) => {
        const currentY = doc.y;
        doc.fontSize(10).fillColor(darkText);
        doc.text(med.name || "—", 50, currentY, { width: 150 });
        doc.text(med.dosage || "—", 200, currentY, { width: 100 });
        doc.text(med.duration || "—", 300, currentY, { width: 100 });
        doc.text(med.instructions || "—", 400, currentY, { width: 145 });
        doc.moveDown(0.5);
    });

    doc.moveDown(1);

    // ── Notes ──
    if (prescription.notes) {
        doc.fontSize(12).fillColor(blue).text("Additional Notes", 50);
        doc.moveDown(0.3);
        doc.fontSize(11).fillColor(darkText).text(prescription.notes, 50);
    }

    // ── Footer ──
    doc.moveDown(3);
    const footerLineY = doc.y;
    doc.moveTo(50, footerLineY).lineTo(545, footerLineY).strokeColor("#e5e7eb").lineWidth(1).stroke();
    doc.moveDown(0.5);
    doc.fontSize(8)
        .fillColor(grayText)
        .text("This is a digitally generated prescription from Sahara Healthcare.", {
            align: "center",
        });

    doc.end();
};

module.exports = { generatePrescriptionPdf };
