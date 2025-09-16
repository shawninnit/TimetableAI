"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { FileText, Download, Printer, Table, X, CheckCircle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ExportOptionsProps {
  timetable: any
  onClose: () => void
}

export function ExportOptions({ timetable, onClose }: ExportOptionsProps) {
  const [selectedFormats, setSelectedFormats] = useState<string[]>(["pdf"])
  const [includeStatistics, setIncludeStatistics] = useState(true)
  const [includeLegend, setIncludeLegend] = useState(true)
  const [paperSize, setPaperSize] = useState("a4")
  const [orientation, setOrientation] = useState("landscape")
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const exportFormats = [
    {
      id: "pdf",
      name: "PDF Document",
      description: "Professional PDF format for printing and sharing",
      icon: FileText,
      color: "text-red-600",
    },
    {
      id: "excel",
      name: "Excel Spreadsheet",
      description: "Editable Excel format for further modifications",
      icon: Table,
      color: "text-green-600",
    },
    {
      id: "print",
      name: "Print View",
      description: "Optimized view for direct printing",
      icon: Printer,
      color: "text-blue-600",
    },
  ]

  const handleFormatToggle = (formatId: string) => {
    setSelectedFormats((prev) => (prev.includes(formatId) ? prev.filter((id) => id !== formatId) : [...prev, formatId]))
  }

  const generatePDF = async () => {
    // Simulate PDF generation
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Create a simple PDF-like content
    const content = generateTimetableContent()
    const blob = new Blob([content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `timetable-${timetable.department}-sem${timetable.semester}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generateExcel = async () => {
    // Simulate Excel generation
    await new Promise((resolve) => setTimeout(resolve, 1500))

    const csvContent = generateCSVContent()
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `timetable-${timetable.department}-sem${timetable.semester}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const generatePrintView = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(generatePrintHTML())
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
  }

  const generateTimetableContent = () => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const timeSlots = [
      "09:00-10:00",
      "10:00-11:00",
      "11:15-12:15",
      "12:15-13:15",
      "14:15-15:15",
      "15:15-16:15",
      "16:30-17:30",
    ]

    let content = `TIMETABLE - ${timetable.department} - Semester ${timetable.semester}\n`
    content += `Generated on: ${new Date(timetable.generatedAt).toLocaleString()}\n\n`

    content += "TIME\t\t" + days.join("\t\t") + "\n"
    content += "=".repeat(80) + "\n"

    timeSlots.forEach((timeSlot) => {
      content += `${timeSlot}\t`
      days.forEach((day) => {
        const slot = timetable.schedule[day][timeSlot]
        if (slot.type === "class") {
          content += `${slot.subject} (${slot.room})\t`
        } else if (slot.type === "break") {
          content += `${slot.subject}\t`
        } else {
          content += "Free\t"
        }
      })
      content += "\n"
    })

    if (includeStatistics) {
      content += "\n\nSTATISTICS:\n"
      content += "=".repeat(20) + "\n"
      const totalClasses = Object.values(timetable.schedule).reduce(
        (total: number, day: any) => total + Object.values(day).filter((slot: any) => slot.type === "class").length,
        0,
      )
      content += `Total Classes: ${totalClasses}\n`
      content += `Faculty Involved: ${
        new Set(
          Object.values(timetable.schedule)
            .flatMap((day: any) => Object.values(day))
            .filter((slot: any) => slot.type === "class")
            .map((slot: any) => slot.faculty),
        ).size
      }\n`
    }

    return content
  }

  const generateCSVContent = () => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const timeSlots = [
      "09:00-10:00",
      "10:00-11:00",
      "11:15-12:15",
      "12:15-13:15",
      "14:15-15:15",
      "15:15-16:15",
      "16:30-17:30",
    ]

    let csv = "Time," + days.join(",") + "\n"

    timeSlots.forEach((timeSlot) => {
      csv += `"${timeSlot}",`
      days.forEach((day, index) => {
        const slot = timetable.schedule[day][timeSlot]
        let cellContent = ""
        if (slot.type === "class") {
          cellContent = `${slot.subject} - ${slot.faculty} - ${slot.room}`
        } else if (slot.type === "break") {
          cellContent = slot.subject
        } else {
          cellContent = "Free"
        }
        csv += `"${cellContent}"`
        if (index < days.length - 1) csv += ","
      })
      csv += "\n"
    })

    return csv
  }

  const generatePrintHTML = () => {
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]
    const timeSlots = [
      "09:00-10:00",
      "10:00-11:00",
      "11:15-12:15",
      "12:15-13:15",
      "14:15-15:15",
      "15:15-16:15",
      "16:30-17:30",
    ]

    let html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Timetable - ${timetable.department} Semester ${timetable.semester}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .timetable { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          .timetable th, .timetable td { border: 1px solid #ddd; padding: 8px; text-align: center; }
          .timetable th { background-color: #f5f5f5; font-weight: bold; }
          .class-slot { background-color: #e8f5e8; }
          .break-slot { background-color: #fff3cd; }
          .free-slot { background-color: #f8f9fa; color: #6c757d; }
          .legend { margin-top: 20px; }
          .legend-item { display: inline-block; margin-right: 20px; }
          .legend-color { width: 20px; height: 20px; display: inline-block; margin-right: 5px; vertical-align: middle; }
          @media print { body { margin: 0; } }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>TIMETABLE</h1>
          <h2>${timetable.department} - Semester ${timetable.semester}</h2>
          <p>Generated on: ${new Date(timetable.generatedAt).toLocaleString()}</p>
        </div>
        
        <table class="timetable">
          <thead>
            <tr>
              <th>Time</th>
              ${days.map((day) => `<th>${day}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
    `

    timeSlots.forEach((timeSlot) => {
      html += `<tr><td><strong>${timeSlot}</strong></td>`
      days.forEach((day) => {
        const slot = timetable.schedule[day][timeSlot]
        let cellClass = "free-slot"
        let cellContent = "Free"

        if (slot.type === "class") {
          cellClass = "class-slot"
          cellContent = `<strong>${slot.subject}</strong><br>${slot.faculty}<br>${slot.room}`
        } else if (slot.type === "break") {
          cellClass = "break-slot"
          cellContent = slot.subject
        }

        html += `<td class="${cellClass}">${cellContent}</td>`
      })
      html += "</tr>"
    })

    html += `
          </tbody>
        </table>
    `

    if (includeLegend) {
      html += `
        <div class="legend">
          <h3>Legend:</h3>
          <div class="legend-item">
            <span class="legend-color class-slot"></span>
            <span>Classes</span>
          </div>
          <div class="legend-item">
            <span class="legend-color break-slot"></span>
            <span>Break Time</span>
          </div>
          <div class="legend-item">
            <span class="legend-color free-slot"></span>
            <span>Free Slots</span>
          </div>
        </div>
      `
    }

    html += `
      </body>
      </html>
    `

    return html
  }

  const handleExport = async () => {
    if (selectedFormats.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one export format",
        variant: "destructive",
      })
      return
    }

    setIsExporting(true)

    try {
      for (const format of selectedFormats) {
        switch (format) {
          case "pdf":
            await generatePDF()
            break
          case "excel":
            await generateExcel()
            break
          case "print":
            generatePrintView()
            break
        }
      }

      toast({
        title: "Export Successful",
        description: `Timetable exported in ${selectedFormats.length} format(s)`,
      })

      onClose()
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "An error occurred during export",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Download className="h-5 w-5" />
                Export Timetable
              </CardTitle>
              <CardDescription>
                Export {timetable.department} Semester {timetable.semester} timetable
              </CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Export Formats */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Export Formats</Label>
            <div className="grid grid-cols-1 gap-3">
              {exportFormats.map((format) => (
                <div
                  key={format.id}
                  className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedFormats.includes(format.id) ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                  }`}
                  onClick={() => handleFormatToggle(format.id)}
                >
                  <Checkbox
                    checked={selectedFormats.includes(format.id)}
                    onChange={() => handleFormatToggle(format.id)}
                  />
                  <div className={`p-2 rounded-lg bg-gray-50`}>
                    <format.icon className={`h-4 w-4 ${format.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium">{format.name}</div>
                    <div className="text-sm text-muted">{format.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-4">
            <Label className="text-base font-medium">Export Options</Label>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="paperSize">Paper Size</Label>
                <Select value={paperSize} onValueChange={setPaperSize}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a4">A4</SelectItem>
                    <SelectItem value="a3">A3</SelectItem>
                    <SelectItem value="letter">Letter</SelectItem>
                    <SelectItem value="legal">Legal</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="orientation">Orientation</Label>
                <Select value={orientation} onValueChange={setOrientation}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="landscape">Landscape</SelectItem>
                    <SelectItem value="portrait">Portrait</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox id="includeStatistics" checked={includeStatistics} onCheckedChange={setIncludeStatistics} />
                <Label htmlFor="includeStatistics">Include Statistics</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="includeLegend" checked={includeLegend} onCheckedChange={setIncludeLegend} />
                <Label htmlFor="includeLegend">Include Legend</Label>
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-2">
            <Label className="text-base font-medium">Export Preview</Label>
            <div className="p-4 border rounded-lg bg-muted/30">
              <div className="text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>
                    Timetable: {timetable.department} Semester {timetable.semester}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>
                    Format(s): {selectedFormats.map((f) => exportFormats.find((ef) => ef.id === f)?.name).join(", ")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>
                    Paper: {paperSize.toUpperCase()} {orientation}
                  </span>
                </div>
                {includeStatistics && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Statistics included</span>
                  </div>
                )}
                {includeLegend && (
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Legend included</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleExport} disabled={isExporting || selectedFormats.length === 0} className="flex-1">
              {isExporting ? (
                <>
                  <Download className="mr-2 h-4 w-4 animate-pulse" />
                  Exporting...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Export Timetable
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onClose} disabled={isExporting}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
