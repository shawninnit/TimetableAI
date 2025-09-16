"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExportOptions } from "@/components/export-options"
import { useState } from "react"

interface TimetableViewProps {
  timetable: any
}

export function TimetableView({ timetable }: TimetableViewProps) {
  const [showExportOptions, setShowExportOptions] = useState(false)

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

  const getSlotColor = (slot: any) => {
    if (slot.type === "break") return "bg-orange-50 border-orange-200"
    if (slot.type === "free") return "bg-gray-50 border-gray-200"
    if (slot.subjectType === "practical") return "bg-blue-50 border-blue-200"
    return "bg-green-50 border-green-200"
  }

  const getSlotTextColor = (slot: any) => {
    if (slot.type === "break") return "text-orange-700"
    if (slot.type === "free") return "text-gray-500"
    if (slot.subjectType === "practical") return "text-blue-700"
    return "text-green-700"
  }

  return (
    <div className="space-y-4">
      {/* Export Button */}
      <div className="flex justify-end">
        <Button onClick={() => setShowExportOptions(true)} variant="outline">
          📥 Export Timetable
        </Button>
      </div>

      {/* Export Options Modal */}
      {showExportOptions && <ExportOptions timetable={timetable} onClose={() => setShowExportOptions(false)} />}

      {/* Timetable Grid */}
      <div className="overflow-x-auto" id="timetable-grid">
        <div className="min-w-[800px]">
          {/* Header */}
          <div className="grid grid-cols-6 gap-2 mb-2">
            <div className="p-3 bg-muted rounded-lg text-center font-medium">Time</div>
            {days.map((day) => (
              <div key={day} className="p-3 bg-muted rounded-lg text-center font-medium">
                {day}
              </div>
            ))}
          </div>

          {/* Time Slots */}
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot} className="grid grid-cols-6 gap-2 mb-2">
              <div className="p-3 bg-card border rounded-lg text-center font-medium text-sm flex items-center justify-center">
                🕐 {timeSlot}
              </div>
              {days.map((day) => {
                const slot = timetable.schedule[day][timeSlot]
                return (
                  <div
                    key={`${day}-${timeSlot}`}
                    className={`p-2 border rounded-lg min-h-[80px] ${getSlotColor(slot)}`}
                  >
                    {slot.type === "class" && (
                      <div className="space-y-1">
                        <div className={`font-medium text-xs ${getSlotTextColor(slot)}`}>{slot.subject}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{slot.code}</div>
                        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                          👤 {slot.faculty}
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400">
                          📍 {slot.room}
                        </div>
                        {slot.subjectType && (
                          <Badge variant="outline" className="text-xs">
                            {slot.subjectType}
                          </Badge>
                        )}
                      </div>
                    )}
                    {slot.type === "break" && (
                      <div className={`text-center ${getSlotTextColor(slot)}`}>
                        <div className="font-medium text-sm">{slot.subject}</div>
                      </div>
                    )}
                    {slot.type === "free" && <div className="text-center text-gray-400 text-sm">Free</div>}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Legend</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-50 border border-green-200 rounded"></div>
              <span>Theory Classes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-50 border border-blue-200 rounded"></div>
              <span>Practical Classes</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-orange-50 border border-orange-200 rounded"></div>
              <span>Break Time</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-50 border border-gray-200 rounded"></div>
              <span>Free Slots</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">📚</span>
              <div>
                <div className="text-lg font-bold">
                  {Object.values(timetable.schedule).reduce(
                    (total: number, day: any) =>
                      total + Object.values(day).filter((slot: any) => slot.type === "class").length,
                    0,
                  )}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Total Classes</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">🕐</span>
              <div>
                <div className="text-lg font-bold">
                  {Object.values(timetable.schedule).reduce(
                    (total: number, day: any) =>
                      total + Object.values(day).filter((slot: any) => slot.type === "free").length,
                    0,
                  )}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Free Slots</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">👤</span>
              <div>
                <div className="text-lg font-bold">
                  {
                    new Set(
                      Object.values(timetable.schedule)
                        .flatMap((day: any) => Object.values(day))
                        .filter((slot: any) => slot.type === "class")
                        .map((slot: any) => slot.faculty),
                    ).size
                  }
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Faculty Involved</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <span className="text-lg">📍</span>
              <div>
                <div className="text-lg font-bold">
                  {
                    new Set(
                      Object.values(timetable.schedule)
                        .flatMap((day: any) => Object.values(day))
                        .filter((slot: any) => slot.type === "class")
                        .map((slot: any) => slot.room),
                    ).size
                  }
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">Rooms Used</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
