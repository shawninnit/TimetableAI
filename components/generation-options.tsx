"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Building, Users, BookOpen, GraduationCap, AlertTriangle, CheckCircle } from "lucide-react"

interface GenerationOptionsProps {
  department: string
  semester: string
}

export function GenerationOptions({ department, semester }: GenerationOptionsProps) {
  const [stats, setStats] = useState({
    classrooms: 0,
    faculty: 0,
    subjects: 0,
    batches: 0,
    totalHours: 0,
    availableSlots: 0,
  })

  const [readiness, setReadiness] = useState({
    score: 0,
    issues: [] as string[],
    warnings: [] as string[],
  })

  useEffect(() => {
    const classrooms = JSON.parse(localStorage.getItem("classrooms") || "[]")
    const faculty = JSON.parse(localStorage.getItem("faculty") || "[]")
    const subjects = JSON.parse(localStorage.getItem("subjects") || "[]")
    const batches = JSON.parse(localStorage.getItem("batches") || "[]")
    const constraints = JSON.parse(localStorage.getItem("constraints") || "null")

    // Filter data for selected department and semester
    const deptClassrooms = classrooms.filter((c: any) => c.department === department)
    const deptFaculty = faculty.filter((f: any) => f.department === department)
    const semSubjects = subjects.filter(
      (s: any) => s.department === department && s.semester === Number.parseInt(semester),
    )
    const semBatches = batches.filter(
      (b: any) => b.department === department && b.semester === Number.parseInt(semester),
    )

    const totalHours = semSubjects.reduce((sum: number, subject: any) => sum + (subject.hoursPerWeek || 0), 0)
    const availableSlots = constraints ? constraints.maxClassesPerDay * constraints.workingDaysPerWeek : 35

    setStats({
      classrooms: deptClassrooms.length,
      faculty: deptFaculty.length,
      subjects: semSubjects.length,
      batches: semBatches.length,
      totalHours,
      availableSlots,
    })

    // Calculate readiness score and identify issues
    const issues: string[] = []
    const warnings: string[] = []
    let score = 0

    if (deptClassrooms.length === 0) {
      issues.push("No classrooms available for this department")
    } else {
      score += 20
    }

    if (deptFaculty.length === 0) {
      issues.push("No faculty members assigned to this department")
    } else {
      score += 20
    }

    if (semSubjects.length === 0) {
      issues.push("No subjects configured for this semester")
    } else {
      score += 20
    }

    if (semBatches.length === 0) {
      issues.push("No student batches for this semester")
    } else {
      score += 20
    }

    if (!constraints) {
      issues.push("Scheduling constraints not configured")
    } else {
      score += 20
    }

    // Additional warnings
    if (totalHours > availableSlots) {
      warnings.push(`Total required hours (${totalHours}) exceed available slots (${availableSlots})`)
    }

    if (deptFaculty.length < semSubjects.length) {
      warnings.push("More subjects than faculty members - some faculty will teach multiple subjects")
    }

    const totalCapacity = deptClassrooms.reduce((sum: number, room: any) => sum + room.capacity, 0)
    const totalStudents = semBatches.reduce((sum: number, batch: any) => sum + batch.strength, 0)

    if (totalCapacity < totalStudents) {
      warnings.push("Classroom capacity may be insufficient for all students")
    }

    setReadiness({ score, issues, warnings })
  }, [department, semester])

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100"
    if (score >= 60) return "bg-yellow-100"
    return "bg-red-100"
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Resource Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Overview</CardTitle>
          <CardDescription>
            Available resources for {department} - Semester {semester}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-chart-1/10 rounded-lg">
                <Building className="h-4 w-4 text-chart-1" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.classrooms}</div>
                <div className="text-xs text-muted">Classrooms</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-chart-2/10 rounded-lg">
                <Users className="h-4 w-4 text-chart-2" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.faculty}</div>
                <div className="text-xs text-muted">Faculty</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-chart-3/10 rounded-lg">
                <BookOpen className="h-4 w-4 text-chart-3" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.subjects}</div>
                <div className="text-xs text-muted">Subjects</div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="p-2 bg-chart-4/10 rounded-lg">
                <GraduationCap className="h-4 w-4 text-chart-4" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats.batches}</div>
                <div className="text-xs text-muted">Batches</div>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t">
            <div className="flex justify-between text-sm">
              <span>Required Hours/Week:</span>
              <span className="font-medium">{stats.totalHours}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Available Slots/Week:</span>
              <span className="font-medium">{stats.availableSlots}</span>
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-muted">
                <span>Utilization</span>
                <span>{Math.round((stats.totalHours / stats.availableSlots) * 100)}%</span>
              </div>
              <Progress value={(stats.totalHours / stats.availableSlots) * 100} className="mt-1" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Readiness Assessment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {readiness.score >= 80 ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
            )}
            Readiness Assessment
          </CardTitle>
          <CardDescription>System readiness for timetable generation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Score */}
            <div className="text-center">
              <div className={`text-4xl font-bold ${getScoreColor(readiness.score)}`}>{readiness.score}%</div>
              <div className="text-sm text-muted">Readiness Score</div>
            </div>

            {/* Progress Bar */}
            <div>
              <Progress value={readiness.score} className="w-full" />
            </div>

            {/* Issues */}
            {readiness.issues.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-red-600">Issues to Resolve:</h4>
                {readiness.issues.map((issue, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-red-700">{issue}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Warnings */}
            {readiness.warnings.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-yellow-600">Warnings:</h4>
                {readiness.warnings.map((warning, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-yellow-700">{warning}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Success Message */}
            {readiness.score === 100 && readiness.issues.length === 0 && (
              <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700">All systems ready for timetable generation!</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
