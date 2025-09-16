"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, CheckCircle, Clock } from "lucide-react"

interface ConflictAnalysisProps {
  timetable: any
}

export function ConflictAnalysis({ timetable }: ConflictAnalysisProps) {
  const analyzeConflicts = () => {
    const conflicts: any[] = []
    const warnings: any[] = []
    const suggestions: any[] = []

    // Analyze the schedule for conflicts
    const schedule = timetable.schedule
    const facultySchedule: { [key: string]: string[] } = {}
    const roomSchedule: { [key: string]: string[] } = {}

    // Track faculty and room usage
    Object.keys(schedule).forEach((day) => {
      Object.keys(schedule[day]).forEach((timeSlot) => {
        const slot = schedule[day][timeSlot]
        if (slot.type === "class") {
          const timeKey = `${day}-${timeSlot}`

          // Track faculty
          if (!facultySchedule[slot.faculty]) {
            facultySchedule[slot.faculty] = []
          }
          facultySchedule[slot.faculty].push(timeKey)

          // Track rooms
          if (!roomSchedule[slot.room]) {
            roomSchedule[slot.room] = []
          }
          roomSchedule[slot.room].push(timeKey)
        }
      })
    })

    // Check for faculty conflicts (same faculty, same time)
    Object.keys(facultySchedule).forEach((faculty) => {
      const timeSlots = facultySchedule[faculty]
      const duplicates = timeSlots.filter((slot, index) => timeSlots.indexOf(slot) !== index)
      if (duplicates.length > 0) {
        conflicts.push({
          type: "faculty_conflict",
          message: `${faculty} has overlapping classes`,
          severity: "high",
        })
      }
    })

    // Check for room conflicts
    Object.keys(roomSchedule).forEach((room) => {
      const timeSlots = roomSchedule[room]
      const duplicates = timeSlots.filter((slot, index) => timeSlots.indexOf(slot) !== index)
      if (duplicates.length > 0) {
        conflicts.push({
          type: "room_conflict",
          message: `Room ${room} has overlapping bookings`,
          severity: "high",
        })
      }
    })

    // Check faculty workload
    Object.keys(facultySchedule).forEach((faculty) => {
      const classCount = facultySchedule[faculty].length
      if (classCount > 20) {
        warnings.push({
          type: "workload_high",
          message: `${faculty} has ${classCount} classes (high workload)`,
          severity: "medium",
        })
      } else if (classCount < 5) {
        warnings.push({
          type: "workload_low",
          message: `${faculty} has only ${classCount} classes (underutilized)`,
          severity: "low",
        })
      }
    })

    // Check for back-to-back classes
    let backToBackCount = 0
    Object.keys(schedule).forEach((day) => {
      const daySlots = Object.keys(schedule[day]).sort()
      for (let i = 0; i < daySlots.length - 1; i++) {
        const currentSlot = schedule[day][daySlots[i]]
        const nextSlot = schedule[day][daySlots[i + 1]]
        if (currentSlot.type === "class" && nextSlot.type === "class") {
          backToBackCount++
        }
      }
    })

    if (backToBackCount > 10) {
      warnings.push({
        type: "back_to_back",
        message: `${backToBackCount} back-to-back classes detected`,
        severity: "medium",
      })
    }

    // Generate suggestions
    if (conflicts.length === 0) {
      suggestions.push({
        type: "optimization",
        message: "Consider balancing morning and afternoon slots",
      })
    }

    if (warnings.filter((w) => w.type === "workload_high").length > 0) {
      suggestions.push({
        type: "workload",
        message: "Redistribute classes to balance faculty workload",
      })
    }

    return { conflicts, warnings, suggestions }
  }

  const analysis = analyzeConflicts()

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200"
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200"
      case "low":
        return "text-blue-600 bg-blue-50 border-blue-200"
      default:
        return "text-gray-600 bg-gray-50 border-gray-200"
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-4 w-4" />
      case "medium":
        return <Clock className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Conflict Analysis
        </CardTitle>
        <CardDescription>Automated analysis of potential scheduling conflicts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-red-600">{analysis.conflicts.length}</div>
              <div className="text-sm text-muted">Conflicts</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{analysis.warnings.length}</div>
              <div className="text-sm text-muted">Warnings</div>
            </div>
            <div className="text-center p-3 border rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{analysis.suggestions.length}</div>
              <div className="text-sm text-muted">Suggestions</div>
            </div>
          </div>

          {/* Conflicts */}
          {analysis.conflicts.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-red-600">Critical Conflicts</h4>
              {analysis.conflicts.map((conflict, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 p-3 border rounded-lg ${getSeverityColor(conflict.severity)}`}
                >
                  {getSeverityIcon(conflict.severity)}
                  <span className="text-sm">{conflict.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* Warnings */}
          {analysis.warnings.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-yellow-600">Warnings</h4>
              {analysis.warnings.map((warning, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-2 p-3 border rounded-lg ${getSeverityColor(warning.severity)}`}
                >
                  {getSeverityIcon(warning.severity)}
                  <span className="text-sm">{warning.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* Suggestions */}
          {analysis.suggestions.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-blue-600">Optimization Suggestions</h4>
              {analysis.suggestions.map((suggestion, index) => (
                <div key={index} className="flex items-start gap-2 p-3 border rounded-lg bg-blue-50 border-blue-200">
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                  <span className="text-sm text-blue-700">{suggestion.message}</span>
                </div>
              ))}
            </div>
          )}

          {/* All Clear */}
          {analysis.conflicts.length === 0 && analysis.warnings.length === 0 && (
            <div className="flex items-center gap-2 p-4 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-green-700 font-medium">
                No conflicts detected! This timetable is ready for approval.
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
