import { format } from "date-fns"

export async function exportReportPdf(elementId = "report-pdf-content") {
  const element = document.getElementById(elementId)
  if (!element) throw new Error("Report content not found.")
  document.body.classList.add("exporting-pdf")
  await new Promise((resolve) => setTimeout(resolve, 120))
  try {
    const [{ default: html2canvas }, jsPdfModule] = await Promise.all([import("html2canvas-pro"), import("jspdf")])
    const JsPdfCtor =
      (jsPdfModule as { jsPDF?: new (...args: unknown[]) => { internal: { pageSize: { getWidth: () => number; getHeight: () => number } }; addImage: (...args: unknown[]) => void; addPage: () => void; save: (filename: string) => void } }).jsPDF ??
      (jsPdfModule as { default?: { jsPDF?: new (...args: unknown[]) => { internal: { pageSize: { getWidth: () => number; getHeight: () => number } }; addImage: (...args: unknown[]) => void; addPage: () => void; save: (filename: string) => void } } }).default?.jsPDF
    if (!JsPdfCtor) throw new Error("jsPDF failed to load.")
    const scale = Math.min(1.5, window.devicePixelRatio || 1.5)
    const canvas = await html2canvas(element, {
      scale,
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: element.scrollWidth,
    })
    const pdf = new JsPdfCtor("p", "mm", "letter")
    const pageWidth = pdf.internal.pageSize.getWidth()
    const pageHeight = pdf.internal.pageSize.getHeight()
    const margin = 10
    const contentWidth = pageWidth - margin * 2
    const contentHeight = pageHeight - margin * 2
    const pxPerMm = canvas.width / contentWidth
    const sliceHeightPx = Math.floor(contentHeight * pxPerMm)
    let renderedHeight = 0
    let page = 0
    while (renderedHeight < canvas.height) {
      const sliceCanvas = document.createElement("canvas")
      sliceCanvas.width = canvas.width
      sliceCanvas.height = Math.min(sliceHeightPx, canvas.height - renderedHeight)
      const ctx = sliceCanvas.getContext("2d")
      if (!ctx) break
      ctx.drawImage(canvas, 0, renderedHeight, canvas.width, sliceCanvas.height, 0, 0, canvas.width, sliceCanvas.height)
      const imgData = sliceCanvas.toDataURL("image/jpeg", 0.92)
      const imgHeightMm = sliceCanvas.height / pxPerMm
      if (page > 0) pdf.addPage()
      pdf.addImage(imgData, "JPEG", margin, margin, contentWidth, imgHeightMm)
      renderedHeight += sliceCanvas.height
      page += 1
    }
    pdf.save(`scarlett-cardiology-report-${format(new Date(), "yyyy-MM-dd")}.pdf`)
    return
  } finally {
    document.body.classList.remove("exporting-pdf")
  }
}
