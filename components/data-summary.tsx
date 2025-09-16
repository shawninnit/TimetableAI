"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, Users, BookOpen, GraduationCap, Settings, AlertCircle, CheckCircle } from "lucide-react"

export function DataSummary() {
  const [data, setData] = useState({
    classrooms: [],
    faculty: [],
    subjects: [],
    batches: [],
    constraints: null,
  })

  useEffect(() => {
    const classrooms = JSON.parse(localStorage.getItem("classrooms") || "[]")
    const faculty = JSON.parse(localStorage.getItem("faculty") || "[]")
    const subjects = JSON.parse(localStorage.getItem("subjects") || "[]")
    const batches = JSON.parse(localStorage.getItem("batches") || "[]")
    const constraints = JSON.parse(localStorage.getItem("constraints") || "null")

    setData({ classrooms, faculty, subjects, batches, constraints })
  }, [])

  const summaryCards = [
    {
      title: "Classrooms",
      count: data.classrooms.length,
      icon: Building,
      description: "Lecture halls, labs, and seminar rooms",
      color: "text-chart-1",
      bgColor: "bg-chart-1/10",
    },
    {
      title: "Faculty Members",
      count: data.faculty.length,
      icon: Users,
      description: "Teaching staff across departments",
      color: "text-chart-2",
      bgColor: "bg-chart-2/10",
    },
    {
      title: "Subjects",
      count: data.subjects.length,
      icon: BookOpen,
      description: "Courses and subjects to be scheduled",
      color: "text-chart-3",
      bgColor: "bg-chart-3/10",
    },
    {
      title: "Student Batches",
      count: data.batches.length,
      icon: GraduationCap,
      description: "Student groups across semesters",
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ]

  const getReadinessStatus = () => {
    const hasClassrooms = data.classrooms.length > 0
    const hasFaculty = data.faculty.length > 0
    const hasSubjects = data.subjects.length > 0
    const hasBatches = data.batches.length > 0
    const hasConstraints = data.constraints !== null

    const readyCount = [hasClassrooms, hasFaculty, hasSubjects, hasBatches, hasConstraints].filter(Boolean).length
    const totalCount = 5

    return {
      ready: readyCount === totalCount,
      percentage: Math.round((readyCount / totalCount) * 100),
      missing: [
        !hasClassrooms && "Classrooms",
        !hasFaculty && "Faculty",
        !hasSubjects && "Subjects",
        !hasBatches && "Batches",
        !hasConstraints && "Constraints",
      ].filter(Boolean),
    }
  }

  const status = getReadinessStatus()

  return (
    <div className="space-y-6">
      {/* Readiness Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {status.ready ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
            Timetable Generation Readiness
          </CardTitle>
          <CardDescription>
            {status.ready
              ? "All required data has been configured. Ready to generate timetables!"
              : `${status.percentage}% complete. Missing: ${status.missing.join(", ")}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                status.ready ? "bg-green-600" : "bg-yellow-600"
              }`}
              style={{ width: `${status.percentage}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{card.count}</div>
              <p className="text-xs text-muted">{card.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Resources by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Array.from(
                new Set([
                  ...data.classrooms.map((c: any) => c.department),
                  ...data.faculty.map((f: any) => f.department),
                  ...data.subjects.map((s: any) => s.department),
                  ...data.batches.map((b: any) => b.department),
                ]),
              ).map((dept) => (
                <div key={dept} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{dept}</span>
                  <div className="flex gap-2">
                    <Badge variant="outline" className="text-xs">
                      {data.classrooms.filter((c: any) => c.department === dept).length} rooms
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {data.faculty.filter((f: any) => f.department === dept).length} faculty
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {data.subjects.filter((s: any) => s.department === dept).length} subjects
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Constraints Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Current Constraints
            </CardTitle>
            <CardDescription>Active scheduling constraints</CardDescription>
          </CardHeader>
          <CardContent>
            {data.constraints ? (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Max classes per day:</span>
                  <Badge variant="outline">{(data.constraints as any).maxClassesPerDay}</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Working hours:</span>
                  <Badge variant="outline">
                    {(data.constraints as any).startTime} - {(data.constraints as any).endTime}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span>Working days:</span>
                  <Badge variant="outline">{(data.constraints as any).workingDaysPerWeek} days/week</Badge>
                </div>
                <div className="flex justify-between">
                  <span>Lunch break:</span>
                  <Badge variant="outline">{(data.constraints as any).lunchBreakDuration} minutes</Badge>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted">No constraints configured yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
