"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { ExportOptions } from "@/components/export-options"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Download, BarChart3, PieChartIcon, Calendar, Users, Building, BookOpen } from "lucide-react"

export function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState("utilization")
  const [selectedDepartment, setSelectedDepartment] = useState("all")
  const [showExportOptions, setShowExportOptions] = useState(false)
  const [reportData, setReportData] = useState<any>(null)

  const reportTypes = [
    {
      id: "utilization",
      name: "Room Utilization",
      description: "Analyze classroom and lab usage efficiency",
      icon: Building,
    },
    {
      id: "workload",
      name: "Faculty Workload",
      description: "Review faculty teaching hours distribution",
      icon: Users,
    },
    {
      id: "schedule",
      name: "Schedule Analysis",
      description: "Examine time slot distribution and patterns",
      icon: Calendar,
    },
    {
      id: "subjects",
      name: "Subject Distribution",
      description: "View subject allocation across departments",
      icon: BookOpen,
    },
  ]

  useEffect(() => {
    generateReportData()
  }, [selectedReport, selectedDepartment])

  const generateReportData = () => {
    // Generate mock report data based on selected report type
    switch (selectedReport) {
      case "utilization":
        setReportData({
          chartData: [
            { name: "LH-101", utilization: 85, capacity: 60 },
            { name: "LH-102", utilization: 72, capacity: 80 },
            { name: "Lab-CS-01", utilization: 95, capacity: 30 },
            { name: "Lab-CS-02", utilization: 68, capacity: 30 },
            { name: "Seminar-01", utilization: 45, capacity: 25 },
          ],
          summary: {
            averageUtilization: 73,
            totalRooms: 24,
            underutilized: 8,
            overutilized: 3,
          },
        })
        break
      case "workload":
        setReportData({
          chartData: [
            { name: "Dr. Smith", hours: 22, maxHours: 20 },
            { name: "Dr. Johnson", hours: 18, maxHours: 20 },
            { name: "Prof. Wilson", hours: 25, maxHours: 20 },
            { name: "Dr. Brown", hours: 15, maxHours: 20 },
            { name: "Dr. Davis", hours: 20, maxHours: 20 },
          ],
          summary: {
            averageHours: 20,
            totalFaculty: 156,
            overloaded: 12,
            underutilized: 23,
          },
        })
        break
      case "schedule":
        setReportData({
          chartData: [
            { name: "9:00-10:00", classes: 45 },
            { name: "10:00-11:00", classes: 52 },
            { name: "11:15-12:15", classes: 48 },
            { name: "14:15-15:15", classes: 38 },
            { name: "15:15-16:15", classes: 35 },
            { name: "16:30-17:30", classes: 28 },
          ],
          summary: {
            peakHour: "10:00-11:00",
            totalSlots: 35,
            averageClasses: 41,
            freeSlots: 89,
          },
        })
        break
      case "subjects":
        setReportData({
          chartData: [
            { name: "Computer Science", value: 45, color: "#8884d8" },
            { name: "Mathematics", value: 32, color: "#82ca9d" },
            { name: "Physics", value: 28, color: "#ffc658" },
            { name: "Chemistry", value: 25, color: "#ff7300" },
            { name: "Electronics", value: 22, color: "#00ff00" },
          ],
          summary: {
            totalSubjects: 152,
            departments: 8,
            averagePerDept: 19,
            electiveSubjects: 34,
          },
        })
        break
    }
  }

  const renderChart = () => {
    if (!reportData) return null

    switch (selectedReport) {
      case "utilization":
      case "workload":
      case "schedule":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={reportData.chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey={
                  selectedReport === "utilization" ? "utilization" : selectedReport === "workload" ? "hours" : "classes"
                }
                fill="#8884d8"
              />
            </BarChart>
          </ResponsiveContainer>
        )
      case "subjects":
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={reportData.chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {reportData.chartData.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        )
      default:
        return null
    }
  }

  const getSummaryCards = () => {
    if (!reportData?.summary) return []

    switch (selectedReport) {
      case "utilization":
        return [
          { title: "Average Utilization", value: `${reportData.summary.averageUtilization}%`, color: "text-blue-600" },
          { title: "Total Rooms", value: reportData.summary.totalRooms, color: "text-green-600" },
          { title: "Underutilized", value: reportData.summary.underutilized, color: "text-yellow-600" },
          { title: "Overutilized", value: reportData.summary.overutilized, color: "text-red-600" },
        ]
      case "workload":
        return [
          { title: "Average Hours", value: reportData.summary.averageHours, color: "text-blue-600" },
          { title: "Total Faculty", value: reportData.summary.totalFaculty, color: "text-green-600" },
          { title: "Overloaded", value: reportData.summary.overloaded, color: "text-red-600" },
          { title: "Underutilized", value: reportData.summary.underutilized, color: "text-yellow-600" },
        ]
      case "schedule":
        return [
          { title: "Peak Hour", value: reportData.summary.peakHour, color: "text-blue-600" },
          { title: "Total Slots", value: reportData.summary.totalSlots, color: "text-green-600" },
          { title: "Average Classes", value: reportData.summary.averageClasses, color: "text-purple-600" },
          { title: "Free Slots", value: reportData.summary.freeSlots, color: "text-gray-600" },
        ]
      case "subjects":
        return [
          { title: "Total Subjects", value: reportData.summary.totalSubjects, color: "text-blue-600" },
          { title: "Departments", value: reportData.summary.departments, color: "text-green-600" },
          { title: "Average per Dept", value: reportData.summary.averagePerDept, color: "text-purple-600" },
          { title: "Elective Subjects", value: reportData.summary.electiveSubjects, color: "text-orange-600" },
        ]
      default:
        return []
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Reports & Analytics</h1>
          <p className="text-muted">Generate comprehensive reports and analyze timetable data</p>
        </div>
        <Button onClick={() => setShowExportOptions(true)} variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Export Options Modal */}
      {showExportOptions && reportData && (
        <ExportOptions
          timetable={{
            department: selectedDepartment === "all" ? "All Departments" : selectedDepartment,
            semester: "Report",
            generatedAt: new Date().toISOString(),
            reportType: selectedReport,
            reportData: reportData,
          }}
          onClose={() => setShowExportOptions(false)}
        />
      )}

      {/* Report Controls */}
      <Card>
        <CardHeader>
          <CardTitle>Report Configuration</CardTitle>
          <CardDescription>Select report type and filters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="reportType">Report Type</Label>
              <Select value={selectedReport} onValueChange={setSelectedReport}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {reportTypes.map((report) => (
                    <SelectItem key={report.id} value={report.id}>
                      {report.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  <SelectItem value="computer-science">Computer Science</SelectItem>
                  <SelectItem value="mathematics">Mathematics</SelectItem>
                  <SelectItem value="physics">Physics</SelectItem>
                  <SelectItem value="chemistry">Chemistry</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Summary */}
      {reportData && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {getSummaryCards().map((card, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-foreground">{card.value}</div>
                <div className="text-sm text-muted">{card.title}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Report Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {selectedReport === "subjects" ? <PieChartIcon className="h-5 w-5" /> : <BarChart3 className="h-5 w-5" />}
            {reportTypes.find((r) => r.id === selectedReport)?.name}
          </CardTitle>
          <CardDescription>{reportTypes.find((r) => r.id === selectedReport)?.description}</CardDescription>
        </CardHeader>
        <CardContent>{renderChart()}</CardContent>
      </Card>

      {/* Detailed Data Table */}
      {reportData && (
        <Card>
          <CardHeader>
            <CardTitle>Detailed Data</CardTitle>
            <CardDescription>Raw data for the selected report</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-200">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-gray-200 p-2 text-left">Name</th>
                    <th className="border border-gray-200 p-2 text-left">
                      {selectedReport === "utilization"
                        ? "Utilization %"
                        : selectedReport === "workload"
                          ? "Hours"
                          : selectedReport === "schedule"
                            ? "Classes"
                            : "Count"}
                    </th>
                    {selectedReport === "utilization" && (
                      <th className="border border-gray-200 p-2 text-left">Capacity</th>
                    )}
                    {selectedReport === "workload" && (
                      <th className="border border-gray-200 p-2 text-left">Max Hours</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {reportData.chartData.map((item: any, index: number) => (
                    <tr key={index} className="hover:bg-muted/50">
                      <td className="border border-gray-200 p-2">{item.name}</td>
                      <td className="border border-gray-200 p-2">
                        {selectedReport === "utilization"
                          ? `${item.utilization}%`
                          : selectedReport === "workload"
                            ? item.hours
                            : selectedReport === "schedule"
                              ? item.classes
                              : item.value}
                      </td>
                      {selectedReport === "utilization" && (
                        <td className="border border-gray-200 p-2">{item.capacity}</td>
                      )}
                      {selectedReport === "workload" && <td className="border border-gray-200 p-2">{item.maxHours}</td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
