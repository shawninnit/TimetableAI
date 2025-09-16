"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function FacultyDashboard() {
  const [availability, setAvailability] = useState<{ [key: string]: boolean }>({
    "monday-9": true,
    "monday-10": true,
    "monday-11": false,
    "monday-14": true,
    "monday-15": true,
    "tuesday-9": true,
    "tuesday-10": false,
    "tuesday-11": true,
    "tuesday-14": true,
    "tuesday-15": true,
    "wednesday-9": false,
    "wednesday-10": true,
    "wednesday-11": true,
    "wednesday-14": false,
    "wednesday-15": true,
    "thursday-9": true,
    "thursday-10": true,
    "thursday-11": true,
    "thursday-14": true,
    "thursday-15": false,
    "friday-9": true,
    "friday-10": true,
    "friday-11": true,
    "friday-14": true,
    "friday-15": true,
  })

  const [selectedView, setSelectedView] = useState<"today" | "week" | "availability">("today")

  // Mock data for faculty schedule
  const upcomingClasses = [
    {
      subject: "Data Structures",
      code: "CS301",
      time: "10:00-11:00",
      room: "LH-101",
      batch: "CS-2024-A",
      type: "theory",
    },
    {
      subject: "Database Lab",
      code: "CS302L",
      time: "14:15-16:15",
      room: "Lab-CS-01",
      batch: "CS-2024-B",
      type: "practical",
    },
    {
      subject: "Algorithms",
      code: "CS401",
      time: "11:15-12:15",
      room: "LH-102",
      batch: "CS-2023-A",
      type: "theory",
    },
  ]

  const weeklySchedule = {
    monday: [
      { time: "9:00-10:00", subject: "Data Structures", code: "CS301", room: "LH-101", batch: "CS-2024-A" },
      { time: "10:00-11:00", subject: "Algorithms", code: "CS401", room: "LH-102", batch: "CS-2023-A" },
      { time: "14:00-15:00", subject: "Database Theory", code: "CS302", room: "LH-103", batch: "CS-2024-B" },
    ],
    tuesday: [
      { time: "9:00-10:00", subject: "Data Structures Lab", code: "CS301L", room: "Lab-CS-01", batch: "CS-2024-A" },
      { time: "11:00-12:00", subject: "Algorithms", code: "CS401", room: "LH-102", batch: "CS-2023-B" },
      { time: "14:00-16:00", subject: "Database Lab", code: "CS302L", room: "Lab-CS-02", batch: "CS-2024-B" },
    ],
    wednesday: [
      { time: "10:00-11:00", subject: "Data Structures", code: "CS301", room: "LH-101", batch: "CS-2024-C" },
      { time: "11:00-12:00", subject: "Database Theory", code: "CS302", room: "LH-103", batch: "CS-2024-A" },
      { time: "15:00-16:00", subject: "Algorithms", code: "CS401", room: "LH-102", batch: "CS-2023-A" },
    ],
    thursday: [
      { time: "9:00-10:00", subject: "Data Structures", code: "CS301", room: "LH-101", batch: "CS-2024-B" },
      { time: "10:00-11:00", subject: "Database Theory", code: "CS302", room: "LH-103", batch: "CS-2024-C" },
      { time: "11:00-12:00", subject: "Algorithms", code: "CS401", room: "LH-102", batch: "CS-2023-C" },
      { time: "14:00-15:00", subject: "Database Lab", code: "CS302L", room: "Lab-CS-01", batch: "CS-2024-A" },
    ],
    friday: [
      { time: "9:00-10:00", subject: "Algorithms Lab", code: "CS401L", room: "Lab-CS-02", batch: "CS-2023-A" },
      { time: "10:00-11:00", subject: "Data Structures", code: "CS301", room: "LH-101", batch: "CS-2024-A" },
      { time: "11:00-12:00", subject: "Database Theory", code: "CS302", room: "LH-103", batch: "CS-2024-B" },
      { time: "14:00-15:00", subject: "Algorithms", code: "CS401", room: "LH-102", batch: "CS-2023-B" },
    ],
  }

  const weeklyStats = {
    totalClasses: 18,
    hoursScheduled: 22,
    roomsAssigned: 5,
    batchesTaught: 3,
  }

  const timeSlots = ["9:00-10:00", "10:00-11:00", "11:00-12:00", "14:00-15:00", "15:00-16:00"]
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday"]

  const toggleAvailability = (day: string, timeIndex: number) => {
    const key = `${day}-${9 + timeIndex + (timeIndex >= 3 ? 2 : 0)}`
    setAvailability((prev) => ({
      ...prev,
      [key]: !prev[key],
    }))
  }

  const saveAvailability = () => {
    console.log("[v0] Saving availability:", availability)
    // Here you would typically save to a backend
    alert("Availability preferences saved successfully!")
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Faculty Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400">Manage your schedule and teaching assignments</p>
      </div>

      {/* Weekly Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Classes</CardTitle>
            <span className="text-lg">📚</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{weeklyStats.totalClasses}</div>
            <p className="text-xs text-gray-500 dark:text-gray-500">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Hours Scheduled</CardTitle>
            <span className="text-lg">⏰</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{weeklyStats.hoursScheduled}</div>
            <p className="text-xs text-gray-500 dark:text-gray-500">Teaching hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Rooms Assigned</CardTitle>
            <span className="text-lg">📍</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{weeklyStats.roomsAssigned}</div>
            <p className="text-xs text-gray-500 dark:text-gray-500">Different locations</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Batches</CardTitle>
            <span className="text-lg">👥</span>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{weeklyStats.batchesTaught}</div>
            <p className="text-xs text-gray-500 dark:text-gray-500">Student groups</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={selectedView} onValueChange={(value) => setSelectedView(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="today">Today's Schedule</TabsTrigger>
          <TabsTrigger value="week">Weekly Schedule</TabsTrigger>
          <TabsTrigger value="availability">Availability Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <span className="text-lg">📅</span>
                Today's Schedule
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">Your classes for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingClasses.map((classItem, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{classItem.time}</div>
                        <Badge variant={classItem.type === "practical" ? "secondary" : "outline"} className="text-xs">
                          {classItem.type}
                        </Badge>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-gray-100">{classItem.subject}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{classItem.code}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 text-sm text-gray-900 dark:text-gray-100">
                        <span>📍</span>
                        {classItem.room}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                        <span>👥</span>
                        {classItem.batch}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="week" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <span className="text-lg">📊</span>
                Weekly Schedule Overview
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Your complete weekly teaching schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-6 gap-2 min-w-[800px]">
                  {/* Header */}
                  <div className="font-semibold text-center p-2 text-gray-900 dark:text-gray-100">Time</div>
                  {days.map((day) => (
                    <div
                      key={day}
                      className="font-semibold text-center p-2 text-gray-900 dark:text-gray-100 capitalize"
                    >
                      {day}
                    </div>
                  ))}

                  {/* Schedule Grid */}
                  {timeSlots.map((timeSlot, timeIndex) => (
                    <div key={timeSlot} className="contents">
                      <div className="text-sm font-medium p-2 text-center bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                        {timeSlot}
                      </div>
                      {days.map((day) => {
                        const daySchedule = weeklySchedule[day as keyof typeof weeklySchedule]
                        const classForSlot = daySchedule.find((cls) => cls.time === timeSlot)

                        return (
                          <div key={`${day}-${timeSlot}`} className="p-2 border min-h-[80px]">
                            {classForSlot ? (
                              <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded text-xs">
                                <div className="font-medium text-blue-900 dark:text-blue-100">
                                  {classForSlot.subject}
                                </div>
                                <div className="text-blue-700 dark:text-blue-300">{classForSlot.code}</div>
                                <div className="text-blue-600 dark:text-blue-400">{classForSlot.room}</div>
                                <div className="text-blue-600 dark:text-blue-400">{classForSlot.batch}</div>
                              </div>
                            ) : (
                              <div className="text-gray-400 dark:text-gray-600 text-xs text-center">Free</div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
                <span className="text-lg">⚙️</span>
                Availability Settings
              </CardTitle>
              <CardDescription className="text-gray-600 dark:text-gray-400">
                Set your preferred teaching hours. Green = Available, Red = Not Available
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-6 gap-2 min-w-[800px]">
                    {/* Header */}
                    <div className="font-semibold text-center p-2 text-gray-900 dark:text-gray-100">Time</div>
                    {days.map((day) => (
                      <div
                        key={day}
                        className="font-semibold text-center p-2 text-gray-900 dark:text-gray-100 capitalize"
                      >
                        {day}
                      </div>
                    ))}

                    {/* Availability Grid */}
                    {timeSlots.map((timeSlot, timeIndex) => (
                      <div key={timeSlot} className="contents">
                        <div className="text-sm font-medium p-2 text-center bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100">
                          {timeSlot}
                        </div>
                        {days.map((day) => {
                          const key = `${day}-${9 + timeIndex + (timeIndex >= 3 ? 2 : 0)}`
                          const isAvailable = availability[key]

                          return (
                            <div key={`${day}-${timeSlot}`} className="p-1">
                              <button
                                onClick={() => toggleAvailability(day, timeIndex)}
                                className={`w-full h-16 rounded border-2 transition-colors ${
                                  isAvailable
                                    ? "bg-green-100 border-green-300 hover:bg-green-200 dark:bg-green-900 dark:border-green-700 dark:hover:bg-green-800"
                                    : "bg-red-100 border-red-300 hover:bg-red-200 dark:bg-red-900 dark:border-red-700 dark:hover:bg-red-800"
                                }`}
                              >
                                <span className="text-lg">{isAvailable ? "✅" : "❌"}</span>
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Click on time slots to toggle your availability
                  </div>
                  <Button onClick={saveAvailability} className="bg-blue-600 hover:bg-blue-700 text-white">
                    Save Availability Preferences
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Notifications */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 dark:text-gray-100">
            <span className="text-lg">🔔</span>
            Notifications
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Important updates and announcements
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <span className="text-blue-600 mt-0.5">ℹ️</span>
              <div>
                <div className="text-sm font-medium text-blue-900 dark:text-blue-100">New Timetable Generated</div>
                <div className="text-xs text-blue-700 dark:text-blue-300">
                  A new timetable for Computer Science Semester 5 has been generated and is pending review.
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
              <span className="text-yellow-600 mt-0.5">⚠️</span>
              <div>
                <div className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Room Change Notice</div>
                <div className="text-xs text-yellow-700 dark:text-yellow-300">
                  Your Database Lab class has been moved from Lab-CS-01 to Lab-CS-02 for tomorrow.
                </div>
                <div className="text-xs text-yellow-600 dark:text-yellow-400 mt-1">1 day ago</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
