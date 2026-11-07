import { jsPDF } from "jspdf";

import type { Booking } from "@/types/studio";
import { formatBookingDate, formatBookingTime, formatCurrency } from "@/lib/format";

/** Ink/clay palette pulled from the design tokens so the PDF matches the app. */
const INK: [number, number, number] = [26, 26, 26];
const CLAY: [number, number, number] = [176, 92, 62];
const MUTED: [number, number, number] = [122, 118, 112];
const RULE: [number, number, number] = [224, 220, 214];

function money(amount: number) {
  return formatCurrency(amount);
}

/**
 * Booking invoice (Optional requirement) — generated entirely client-side with
 * jsPDF, so no server round-trip or PDF dependency is needed at deploy time.
 */
export function downloadBookingInvoice(
  booking: Booking,
  customer: { name: string; email: string },
) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 48;
  const contentWidth = pageWidth - margin * 2;
  let y = 56;

  // ── Header ────────────────────────────────────────────────────────────────
  doc.setDrawColor(...RULE);
  doc.setLineWidth(1);
  doc.line(margin, y - 24, pageWidth - margin, y - 24);

  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.text("StudioSpace", margin, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text("Peer-to-peer creative studios", margin, y + 14);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.setTextColor(...CLAY);
  doc.text("BOOKING INVOICE", pageWidth - margin, y, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(`Invoice #SS-${booking._id.slice(-8).toUpperCase()}`, pageWidth - margin, y + 14, {
    align: "right",
  });
  doc.text(`Issued ${formatBookingDate(new Date().toISOString())}`, pageWidth - margin, y + 26, {
    align: "right",
  });

  y += 56;

  // ── Parties ───────────────────────────────────────────────────────────────
  const half = contentWidth / 2;
  doc.setTextColor(...INK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("BILLED TO", margin, y);
  doc.text("HOSTED BY", margin + half, y);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.text(customer.name, margin, y + 16);
  doc.text(booking.hostEmail || "StudioSpace host", margin + half, y + 16);
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text(customer.email, margin, y + 30);
  doc.text(`Booking ${booking.status}`, margin + half, y + 30);

  y += 56;
  doc.setDrawColor(...RULE);
  doc.line(margin, y, pageWidth - margin, y);
  y += 22;

  // ── Line items ────────────────────────────────────────────────────────────
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...MUTED);
  doc.text("DESCRIPTION", margin, y);
  doc.text("DETAIL", margin + contentWidth * 0.55, y);
  doc.text("AMOUNT", pageWidth - margin, y, { align: "right" });
  y += 8;
  doc.setDrawColor(...RULE);
  doc.line(margin, y, pageWidth - margin, y);
  y += 20;

  const items: { label: string; value: string }[] = [
    { label: "Studio rental", value: booking.studioTitle },
    { label: "Session date", value: formatBookingDate(booking.bookingDate) },
    {
      label: "Time slot",
      value: formatBookingTime(booking.bookingDate) || "Full day",
    },
    { label: "Host", value: booking.hostEmail || "StudioSpace host" },
  ];

  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  doc.setTextColor(...INK);
  for (const item of items) {
    doc.text(item.label, margin, y);
    doc.text(item.value, margin + contentWidth * 0.55, y);
    y += 22;
  }

  // Single priced line — the API stores one totalPrice per booking.
  doc.text("Total due", margin, y);
  doc.setFont("helvetica", "bold");
  doc.text(money(booking.totalPrice), pageWidth - margin, y, { align: "right" });
  y += 10;

  doc.setDrawColor(...RULE);
  doc.line(margin, y, pageWidth - margin, y);
  y += 26;

  // ── Summary block ─────────────────────────────────────────────────────────
  const boxTop = y;
  const boxHeight = 78;
  doc.setFillColor(247, 244, 239);
  doc.roundedRect(margin, boxTop, contentWidth, boxHeight, 8, 8, "F");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(...MUTED);
  doc.text("Booking reference", margin + 16, boxTop + 26);
  doc.text("Status", margin + 16, boxTop + 48);

  doc.setTextColor(...INK);
  doc.text(`#${booking._id.slice(-6).toUpperCase()}`, margin + contentWidth * 0.45, boxTop + 26);
  doc.text(booking.status, margin + contentWidth * 0.45, boxTop + 48);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(...CLAY);
  doc.text(money(booking.totalPrice), pageWidth - margin - 16, boxTop + 44, { align: "right" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  doc.text("TOTAL", pageWidth - margin - 16, boxTop + 60, { align: "right" });

  y = boxTop + boxHeight + 40;

  // ── Footer note ───────────────────────────────────────────────────────────
  doc.setFontSize(8);
  doc.setTextColor(...MUTED);
  const note = doc.splitTextToSize(
    "This invoice was generated by StudioSpace for the reservation above. Payment terms, cancellations and house rules are agreed with the host directly. Keep this document for your records.",
    contentWidth,
  );
  doc.text(note, margin, y);

  doc.setDrawColor(...RULE);
  doc.line(margin, doc.internal.pageSize.getHeight() - 52, pageWidth - margin, doc.internal.pageSize.getHeight() - 52);
  doc.setFontSize(8);
  doc.text(
    "StudioSpace · studiospace.demo",
    margin,
    doc.internal.pageSize.getHeight() - 38,
  );
  doc.text("Thank you for booking with us.", pageWidth - margin, doc.internal.pageSize.getHeight() - 38, {
    align: "right",
  });

  const slug =
    booking.studioTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/gi, "-")
      .replace(/^-|-$/g, "") || "studio";
  doc.save(`studiospace-invoice-${slug}-${booking._id.slice(-6)}.pdf`);
}
