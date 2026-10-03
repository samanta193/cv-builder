/* ------------------------------------------------------------------ *
 * PDF GENERATION
 *
 * The exact html2canvas-pro + jsPDF pipeline that used to live inside
 * app/builder/page.tsx, moved here so the builder and the My CVs page
 * share one implementation.
 * ------------------------------------------------------------------ */

export async function generateResumePdf(
  element: HTMLElement,
  fileName: string
): Promise<void> {
  const html2canvas = (await import("html2canvas-pro")).default;
  const { jsPDF } = await import("jspdf");

  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
  });

  const imgData = canvas.toDataURL("image/jpeg", 0.98);

  const pdf = new jsPDF({
    unit: "mm",
    format: "a4",
    orientation: "portrait",
  });

  const pageWidth = 210;
  const pageHeight = 297;

  const imgWidth = pageWidth;
  const imgHeight = (canvas.height * imgWidth) / canvas.width;

  let heightLeft = imgHeight;
  let position = 0;

  pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);

  heightLeft -= pageHeight;

  while (heightLeft > 0) {
    position = heightLeft - imgHeight;
    pdf.addPage();
    pdf.addImage(imgData, "JPEG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
  }

  pdf.save(`${safeFileName(fileName)}.pdf`);
}

export function safeFileName(value: string): string {
  const cleaned = value
    .trim()
    .replace(/[^a-z0-9\-_ ]/gi, "")
    .replace(/\s+/g, "-");

  return cleaned || "resume";
}
