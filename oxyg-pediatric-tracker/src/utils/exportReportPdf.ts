import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import { format } from "date-fns"

export async function exportReportPdf(elementId = "report-pdf-content") {
  const element = document.getElementById(elementId)
  if (!element) throw new Error("Report content not found.")
  const canvas = await html2canvas(element, { scale: 2, backgroundColor: "#ffffff", useCORS: true })
  const imgData = canvas.toDataURL("image/png")
  const pdf = new jsPDF("p", "mm", "a4")
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()
  const imgHeight = (canvas.height * pdfWidth) / canvas.width
  let heightLeft = imgHeight
  let position = 0
  pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight)
  heightLeft -= pdfHeight
  while (heightLeft > 0) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pdf.addImage(imgData, "PNG", 0, position, pdfWidth, imgHeight)
    heightLeft -= pdfHeight
  }
  pdf.save(`scarlett-cardiology-report-${format(new Date(), "yyyy-MM-dd")}.pdf`)
}
