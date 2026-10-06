/**
 * Reusable CSV export for tables and list data.
 * Use for: audit logs, activity feeds, member lists, etc.
 */

function escapeCsvCell(value: string | number): string {
  const s = String(value)
  if (s.includes(",") || s.includes('"') || s.includes("\n") || s.includes("\r")) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

export interface ExportToCsvOptions {
  /** Column headers (first row). */
  headers: string[]
  /** Data rows; each row is an array of cell values. */
  rows: (string | number)[][]
  /** Download filename (without or with .csv). */
  filename: string
}

/**
 * Builds a CSV string from headers and rows, triggers a download,
 * and revokes the object URL. Safe to call from event handlers.
 */
export function exportToCsv({ headers, rows, filename }: ExportToCsvOptions): void {
  const headerRow = headers.map(escapeCsvCell).join(",")
  const dataRows = rows.map((row) => row.map(escapeCsvCell).join(","))
  const csv = [headerRow, ...dataRows].join("\n")
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = filename.endsWith(".csv") ? filename : `${filename}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

/**
 * Portfolio summary data for PDF export (angel dashboard).
 * Opens a print-friendly window; user can choose "Save as PDF".
 */
export interface PortfolioSummaryData {
  totalInvested: string
  portfolioCompanies: number
  avgReturn: string
  newDealsToday: number
  date: string
}

export function exportPortfolioSummaryPdf(data: PortfolioSummaryData): void {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Portfolio Summary - Volery</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 24px; max-width: 600px; margin: 0 auto; color: #1f2937; }
    h1 { font-size: 1.5rem; margin-bottom: 8px; }
    .sub { color: #6b7280; font-size: 0.875rem; margin-bottom: 24px; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 10px 0; border-bottom: 1px solid #e5e7eb; }
    th { color: #6b7280; font-weight: 500; }
    .footer { margin-top: 32px; font-size: 0.75rem; color: #9ca3af; }
  </style>
</head>
<body>
  <h1>Portfolio Summary</h1>
  <p class="sub">Volery 2.0 · ${data.date}</p>
  <table>
    <tr><th>Total Invested</th><td>${data.totalInvested}</td></tr>
    <tr><th>Portfolio Companies</th><td>${data.portfolioCompanies}</td></tr>
    <tr><th>Avg Return</th><td>${data.avgReturn}</td></tr>
    <tr><th>New Deals Today</th><td>${data.newDealsToday}</td></tr>
  </table>
  <p class="footer">Generated from Volery Angel Dashboard. This summary is for reference only.</p>
  <script>window.onload = function() { window.print(); }</script>
</body>
</html>
  `.trim()
  const blob = new Blob([html], { type: "text/html;charset=utf-8" })
  const url = URL.createObjectURL(blob)
  const w = window.open(url, "_blank", "noopener")
  if (w) w.onload = () => setTimeout(() => URL.revokeObjectURL(url), 1000)
}

/**
 * Investment report data for Excel (CSV) export. Excel opens CSV natively.
 */
export function exportInvestmentReportExcel(): void {
  const headers = [
    "Company",
    "Stage",
    "Investment Date",
    "Amount (₹)",
    "Current Value (₹)",
    "Multiple",
    "Status",
  ]
  const rows: (string | number)[][] = [
    ["FinSecure", "Series A", "2023-06-15", "2500000", "8000000", "3.2x", "Active"],
    ["DataMesh", "Seed", "2022-11-01", "1500000", "4200000", "2.8x", "Active"],
    ["HealthBridge", "Pre-Seed", "2024-01-10", "500000", "450000", "0.9x", "Watch"],
  ]
  exportToCsv({
    headers,
    rows,
    filename: "Investment-Report.csv",
  })
}
