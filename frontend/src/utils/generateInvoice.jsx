import { jsPDF } from "jspdf";
import "jspdf-autotable";

const generateInvoice = (booking) => {
  const doc = new jsPDF();

  // Format currency function
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(amount)
      .replace("INR", "₹");
  };

  // Company details
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text("Sanjeevani Storage Solutions", 10, 20, { align: "left" });
  doc.text("123 Warehouse Street, Mumbai 400001", 10, 25, { align: "left" });
  doc.text("contact@sanjeevani.com | +91 9876543210", 10, 30, {
    align: "left",
  });

  // Invoice title
  doc.setFontSize(18);
  doc.setTextColor(0);
  doc.text("INVOICE", 105, 50, { align: "center" });

  // Invoice details
  doc.setFontSize(10);
  doc.text(`Invoice No: INV-${booking._id}`, 10, 60);
  doc.text(`Date: ${new Date().toLocaleDateString("en-IN")}`, 170, 60, {
    align: "right",
  });

  // Customer details
  doc.setFontSize(12);
  doc.text("Bill To:", 10, 70);
  doc.setFontSize(10);
  doc.text(booking.userId.name, 10, 75);
  doc.text(booking.userId.email || "N/A", 10, 80);
  doc.text(booking.userId.phoneno || "N/A", 10, 85);

  // Booking details table
  doc.autoTable({
    startY: 95,
    head: [["Description", "Start Date", "End Date", "Duration", "Amount"]],
    body: [
      [
        `${booking.warehouseId.name}`,
        new Date(booking.startDate).toLocaleDateString("en-IN"),
        new Date(booking.endDate).toLocaleDateString("en-IN"),
        `${Math.ceil(
          (new Date(booking.endDate) - new Date(booking.startDate)) /
            (1000 * 60 * 60 * 24)
        )} days`,
        formatCurrency(booking.totalPrice),
      ],
    ],
    styles: {
      fontSize: 9,
      cellPadding: 5,
    },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
      halign: "left",
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 30, halign: "left" },
      2: { cellWidth: 30, halign: "left" },
      3: { cellWidth: 30, halign: "left" },
      4: { cellWidth: 30, halign: "right" },
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 10, right: 10 },
  });

  // Total amount
  const finalY = doc.lastAutoTable.finalY || 120;
  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.text("Total Amount:", 130, finalY + 15);
  doc.setFontSize(12);
  doc.setFont(undefined, "bold");
  doc.text(formatCurrency(booking.totalPrice), 170, finalY + 15, {
    align: "right",
  });

  // Footer
  doc.setFontSize(9);
  doc.setFont(undefined, "normal");
  doc.setTextColor(100);
  doc.text("Thank you for your business!", 105, 280, { align: "center" });
  doc.text("For any queries, please contact our support team.", 105, 285, {
    align: "center",
  });

  // Save the PDF
  doc.save(`invoice_${booking._id}.pdf`);
};

export default generateInvoice;
