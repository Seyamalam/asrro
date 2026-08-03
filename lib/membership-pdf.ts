import { currentMember } from "@/data/dashboard-data"
import {
  membershipCardDimensions,
  membershipQrPattern,
} from "@/data/membership-card"

type Member = typeof currentMember

type Receipt = {
  amount: string
  date: string
  id: string
  period: string
}

async function loadLogo() {
  const response = await fetch("/asrro-logo.png")
  if (!response.ok) throw new Error("Logo could not be loaded")

  const blob = await response.blob()
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()
    reader.addEventListener("load", () => resolve(String(reader.result)))
    reader.addEventListener("error", () => reject(reader.error))
    reader.readAsDataURL(blob)
  })
}

export async function downloadMembershipCardPdf(member: Member) {
  const { jsPDF } = await import("jspdf")
  const { widthMm, heightMm } = membershipCardDimensions
  const document = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [widthMm, heightMm],
    compress: true,
  })

  document.setProperties({
    title: "ASRRO membership card — " + member.name,
    subject: "Membership credential " + member.uuid,
    author: "ASRRO",
  })

  document.setFillColor(8, 24, 45)
  document.roundedRect(0, 0, widthMm, heightMm, 3, 3, "F")

  document.setDrawColor(29, 78, 128)
  document.setLineWidth(0.25)
  document.circle(76, 5, 18, "S")
  document.setDrawColor(22, 111, 145)
  document.circle(76, 5, 12, "S")
  document.setFillColor(103, 232, 249)
  document.circle(72, 12, 0.75, "F")

  document.setFillColor(255, 255, 255)
  document.roundedRect(5, 5, 10, 10, 1.7, 1.7, "F")
  try {
    const logo = await loadLogo()
    document.addImage(logo, "PNG", 5.8, 5.8, 8.4, 8.4)
  } catch {
    document.setTextColor(8, 24, 45)
    document.setFont("helvetica", "bold")
    document.setFontSize(6)
    document.text("A", 10, 11.3, { align: "center" })
  }

  document.setTextColor(255, 255, 255)
  document.setFont("helvetica", "bold")
  document.setFontSize(6.4)
  document.text("ASRRO", 18, 9.2)
  document.setTextColor(148, 163, 184)
  document.setFont("helvetica", "normal")
  document.setFontSize(3.2)
  document.text("ANDROMEDA SPACE & ROBOTICS RESEARCH ORGANIZATION", 18, 12.2)

  document.setTextColor(255, 255, 255)
  document.setFont("helvetica", "bold")
  document.setFontSize(9.5)
  document.text(member.name, 5, 29)
  document.setTextColor(148, 163, 184)
  document.setFont("helvetica", "normal")
  document.setFontSize(4.2)
  document.text(member.shortDepartment + "  /  " + member.batch, 5, 33)

  document.setTextColor(100, 116, 139)
  document.setFontSize(3.1)
  document.text("MEMBER UUID", 5, 41)
  document.text("VALID UNTIL", 31, 41)
  document.setTextColor(207, 250, 254)
  document.setFont("courier", "bold")
  document.setFontSize(5.4)
  document.text(member.uuid, 5, 45.3)
  document.setTextColor(255, 255, 255)
  document.setFont("helvetica", "bold")
  document.setFontSize(4.8)
  document.text("DEC 2026", 31, 45.3)

  const qrX = 65
  const qrY = 30
  const qrSize = 15
  const cellSize = qrSize / membershipQrPattern.length
  document.setFillColor(255, 255, 255)
  document.roundedRect(qrX - 1.5, qrY - 1.5, qrSize + 3, qrSize + 3, 1, 1, "F")
  document.setFillColor(8, 17, 31)
  for (const [rowIndex, row] of membershipQrPattern.entries()) {
    for (const [columnIndex, cell] of Array.from(row).entries()) {
      if (cell === "1") {
        document.rect(
          qrX + columnIndex * cellSize,
          qrY + rowIndex * cellSize,
          cellSize,
          cellSize,
          "F"
        )
      }
    }
  }

  document.setTextColor(103, 232, 249)
  document.setFont("helvetica", "normal")
  document.setFontSize(3)
  document.text("SCAN TO CONFIRM MEMBERSHIP", widthMm - 5, 50.5, {
    align: "right",
  })

  document.save("asrro-membership-" + member.uuid.toLowerCase() + ".pdf")
}

export async function downloadMembershipReceiptPdf(receipt: Receipt) {
  const { jsPDF } = await import("jspdf")
  const document = new jsPDF({ unit: "mm", format: "a5" })

  document.setProperties({
    title: "ASRRO receipt " + receipt.id,
    subject: receipt.period,
    author: "ASRRO",
  })
  document.setFillColor(8, 24, 45)
  document.rect(0, 0, 148, 34, "F")
  document.setTextColor(255, 255, 255)
  document.setFont("helvetica", "bold")
  document.setFontSize(18)
  document.text("ASRRO", 14, 16)
  document.setFont("helvetica", "normal")
  document.setFontSize(8)
  document.text("MEMBERSHIP PAYMENT RECEIPT", 14, 23)

  document.setTextColor(15, 23, 42)
  document.setFont("helvetica", "bold")
  document.setFontSize(14)
  document.text(receipt.period, 14, 54)
  document.setDrawColor(226, 232, 240)
  document.line(14, 61, 134, 61)

  const fields = [
    ["Receipt number", receipt.id],
    ["Payment date", receipt.date],
    ["Member", currentMember.name],
    ["Member UUID", currentMember.uuid],
    ["Amount paid", receipt.amount],
  ] as const
  for (const [index, [label, value]] of fields.entries()) {
    const y = 73 + index * 14
    document.setTextColor(100, 116, 139)
    document.setFont("helvetica", "normal")
    document.setFontSize(8)
    document.text(label, 14, y)
    document.setTextColor(15, 23, 42)
    document.setFont("helvetica", "bold")
    document.text(value, 134, y, { align: "right" })
  }

  document.setFillColor(236, 253, 245)
  document.roundedRect(14, 148, 120, 20, 3, 3, "F")
  document.setTextColor(4, 120, 87)
  document.setFontSize(9)
  document.text("Payment recorded", 22, 160)
  document.setTextColor(100, 116, 139)
  document.setFont("helvetica", "normal")
  document.setFontSize(7)
  document.text("Keep this receipt for your records.", 14, 188)

  document.save("asrro-receipt-" + receipt.id.toLowerCase() + ".pdf")
}
