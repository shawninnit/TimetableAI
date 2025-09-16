"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimetableView } from "@/components/timetable-view"
import { GenerationOptions } from "@/components/generation-options"
import { useToast } from "@/hooks/use-toast"

interface GenerationStatus {
  isGenerating: boolean
  progress: number
  currentStep: string
  completed: boolean
  error?: string
}

interface GenerationPreferences {
  prioritizeConsecutiveClasses: boolean
  avoidBackToBackLabs: boolean
  preferMorningSlots: boolean
  balanceDailyLoad: boolean
  minimizeRoomChanges: boolean
  respectFacultyPreferences: boolean
  allowSplitSubjects: boolean
  maxGapsPerDay: number
  preferredStartTime: string
  preferredEndTime: string
  lunchBreakStart: string
  lunchBreakDuration: number
  specialRequirements: string
}

interface FacultyConstraint {
  facultyId: string
  facultyName: string
  unavailableSlots: string[]
  maxConsecutiveHours: number
  preferredSubjects: string[]
  maxDailyHours: number
}

interface RoomConstraint {
  roomId: string
  roomName: string
  maintenanceSlots: string[]
  dedicatedSubjects: string[]
  capacity: number
}

export function TimetableGenerator() {
  const [selectedDepartment, setSelectedDepartment] = useState("")
  const [selectedSemester, setSelectedSemester] = useState("")
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus>({
    isGenerating: false,
    progress: 0,
    currentStep: "",
    completed: false,
  })
  const [generatedTimetable, setGeneratedTimetable] = useState(null)
  const [departments, setDepartments] = useState<string[]>([])
  const [semesters, setSemesters] = useState<number[]>([])
  const [activeTab, setActiveTab] = useState("basic")

  const [preferences, setPreferences] = useState<GenerationPreferences>({
    prioritizeConsecutiveClasses: true,
    avoidBackToBackLabs: true,
    preferMorningSlots: false,
    balanceDailyLoad: true,
    minimizeRoomChanges: true,
    respectFacultyPreferences: true,
    allowSplitSubjects: false,
    maxGapsPerDay: 2,
    preferredStartTime: "09:00",
    preferredEndTime: "17:00",
    lunchBreakStart: "12:15",
    lunchBreakDuration: 60,
    specialRequirements: "",
  })

  const [facultyConstraints, setFacultyConstraints] = useState<FacultyConstraint[]>([])
  const [roomConstraints, setRoomConstraints] = useState<RoomConstraint[]>([])
  const [availableFaculty, setAvailableFaculty] = useState<any[]>([])
  const [availableRooms, setAvailableRooms] = useState<any[]>([])

  const { toast } = useToast()

  useEffect(() => {
    // Load available departments and semesters from stored data
    const subjects = JSON.parse(localStorage.getItem("subjects") || "[]")
    const batches = JSON.parse(localStorage.getItem("batches") || "[]")
    const faculty = JSON.parse(localStorage.getItem("faculty") || "[]")
    const classrooms = JSON.parse(localStorage.getItem("classrooms") || "[]")

    const defaultDepartments = [
      "Computer Science",
      "Information Technology",
      "Electronics & Communication",
      "Mechanical Engineering",
      "Civil Engineering",
      "Electrical Engineering",
      "Chemical Engineering",
      "Biotechnology",
      "Mathematics",
      "Physics",
      "Chemistry",
      "Business Administration",
      "Commerce",
      "English Literature",
    ]

    const defaultSemesters = [1, 2, 3, 4, 5, 6, 7, 8]

    const uniqueDepartments = Array.from(
      new Set([...subjects.map((s: any) => s.department), ...batches.map((b: any) => b.department)]),
    )
    const uniqueSemesters = Array.from(
      new Set([...subjects.map((s: any) => s.semester), ...batches.map((b: any) => b.semester)]),
    ).sort((a, b) => a - b)

    // Use stored data if available, otherwise use defaults
    setDepartments(uniqueDepartments.length > 0 ? uniqueDepartments : defaultDepartments)
    setSemesters(uniqueSemesters.length > 0 ? uniqueSemesters : defaultSemesters)

    console.log("[v0] Loaded departments:", uniqueDepartments.length > 0 ? uniqueDepartments : defaultDepartments)
    console.log("[v0] Loaded semesters:", uniqueSemesters.length > 0 ? uniqueSemesters : defaultSemesters)

    setAvailableFaculty(faculty)
    setAvailableRooms(classrooms)

    const initialFacultyConstraints = faculty.map((f: any) => ({
      facultyId: f.id,
      facultyName: f.name,
      unavailableSlots: [],
      maxConsecutiveHours: 3,
      preferredSubjects: [],
      maxDailyHours: 6,
    }))
    setFacultyConstraints(initialFacultyConstraints)

    const initialRoomConstraints = classrooms.map((r: any) => ({
      roomId: r.id,
      roomName: r.name,
      maintenanceSlots: [],
      dedicatedSubjects: [],
      capacity: r.capacity,
    }))
    setRoomConstraints(initialRoomConstraints)
  }, [])

  const addFacultyConstraint = () => {
    if (availableFaculty.length === 0) {
      toast({
        title: "No Faculty Available",
        description: "Please add faculty members first",
        variant: "destructive",
      })
      return
    }

    const newConstraint: FacultyConstraint = {
      facultyId: "",
      facultyName: "",
      unavailableSlots: [],
      maxConsecutiveHours: 3,
      preferredSubjects: [],
      maxDailyHours: 6,
    }
    setFacultyConstraints([...facultyConstraints, newConstraint])
  }

  const updateFacultyConstraint = (index: number, field: keyof FacultyConstraint, value: any) => {
    const updated = [...facultyConstraints]
    if (field === "facultyId") {
      const selectedFaculty = availableFaculty.find((f) => f.id === value)
      updated[index].facultyId = value
      updated[index].facultyName = selectedFaculty?.name || ""
    } else {
      updated[index][field] = value as never
    }
    setFacultyConstraints(updated)
  }

  const removeFacultyConstraint = (index: number) => {
    setFacultyConstraints(facultyConstraints.filter((_, i) => i !== index))
  }

  const addRoomConstraint = () => {
    if (availableRooms.length === 0) {
      toast({
        title: "No Rooms Available",
        description: "Please add classrooms first",
        variant: "destructive",
      })
      return
    }

    const newConstraint: RoomConstraint = {
      roomId: "",
      roomName: "",
      maintenanceSlots: [],
      dedicatedSubjects: [],
      capacity: 0,
    }
    setRoomConstraints([...roomConstraints, newConstraint])
  }

  const updateRoomConstraint = (index: number, field: keyof RoomConstraint, value: any) => {
    const updated = [...roomConstraints]
    if (field === "roomId") {
      const selectedRoom = availableRooms.find((r) => r.id === value)
      updated[index].roomId = value
      updated[index].roomName = selectedRoom?.name || ""
      updated[index].capacity = selectedRoom?.capacity || 0
    } else {
      updated[index][field] = value as never
    }
    setRoomConstraints(updated)
  }

  const removeRoomConstraint = (index: number) => {
    setRoomConstraints(roomConstraints.filter((_, i) => i !== index))
  }

  const simulateGeneration = async () => {
    const steps = [
      "Validating input data...",
      "Loading constraints...",
      "Analyzing resource availability...",
      "Initializing optimization algorithm...",
      "Generating initial schedule...",
      "Optimizing for conflicts...",
      "Balancing faculty workload...",
      "Maximizing room utilization...",
      "Finalizing timetable...",
    ]

    setGenerationStatus({
      isGenerating: true,
      progress: 0,
      currentStep: steps[0],
      completed: false,
    })

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 800))
      setGenerationStatus({
        isGenerating: true,
        progress: ((i + 1) / steps.length) * 100,
        currentStep: steps[i],
        completed: false,
      })
    }

    // Generate mock timetable data
    const mockTimetable = generateMockTimetable()
    setGeneratedTimetable(mockTimetable)

    setGenerationStatus({
      isGenerating: false,
      progress: 100,
      currentStep: "Generation completed successfully!",
      completed: true,
    })

    toast({
      title: "Success",
      description: "Timetable generated successfully!",
    })
  }

  const generateMockTimetable = () => {
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

    const subjects = JSON.parse(localStorage.getItem("subjects") || "[]")
    const faculty = JSON.parse(localStorage.getItem("faculty") || "[]")
    const classrooms = JSON.parse(localStorage.getItem("classrooms") || "[]")

    const filteredSubjects = subjects.filter(
      (s: any) => s.department === selectedDepartment && s.semester === Number.parseInt(selectedSemester),
    )

    const schedule: any = {}

    days.forEach((day) => {
      schedule[day] = {}
      timeSlots.forEach((slot, index) => {
        if (index === 3) {
          // Lunch break
          schedule[day][slot] = {
            type: "break",
            subject: "Lunch Break",
            faculty: "",
            room: "",
            batch: "",
          }
        } else if (filteredSubjects.length > 0 && Math.random() > 0.3) {
          const randomSubject = filteredSubjects[Math.floor(Math.random() * filteredSubjects.length)]
          const randomFaculty = faculty.find((f: any) => f.department === selectedDepartment) || faculty[0]
          const randomRoom = classrooms[Math.floor(Math.random() * classrooms.length)]

          schedule[day][slot] = {
            type: "class",
            subject: randomSubject?.name || "Sample Subject",
            code: randomSubject?.code || "CS101",
            faculty: randomFaculty?.name || "Dr. Sample",
            room: randomRoom?.name || "LH-101",
            batch: `${selectedDepartment}-Sem${selectedSemester}`,
            subjectType: randomSubject?.type || "theory",
          }
        } else {
          schedule[day][slot] = {
            type: "free",
            subject: "",
            faculty: "",
            room: "",
            batch: "",
          }
        }
      })
    })

    return {
      id: Date.now().toString(),
      department: selectedDepartment,
      semester: selectedSemester,
      schedule,
      generatedAt: new Date().toISOString(),
      status: "pending_review",
    }
  }

  const handleGenerate = () => {
    if (!selectedDepartment || !selectedSemester) {
      toast({
        title: "Error",
        description: "Please select department and semester",
        variant: "destructive",
      })
      return
    }

    console.log("[v0] Generation preferences:", preferences)
    console.log("[v0] Faculty constraints:", facultyConstraints)
    console.log("[v0] Room constraints:", roomConstraints)

    simulateGeneration()
  }

  const handleReset = () => {
    setGenerationStatus({
      isGenerating: false,
      progress: 0,
      currentStep: "",
      completed: false,
    })
    setGeneratedTimetable(null)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Timetable Generator</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Generate optimized timetables using intelligent algorithms with comprehensive constraints
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">⚡ Timetable Generation Setup</CardTitle>
          <CardDescription>Configure all parameters and constraints for optimal timetable generation</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Setup</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="faculty">Faculty Constraints</TabsTrigger>
              <TabsTrigger value="rooms">Room Constraints</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester">Semester *</Label>
                  <Select value={selectedSemester} onValueChange={setSelectedSemester}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((sem) => (
                        <SelectItem key={sem} value={sem.toString()}>
                          Semester {sem}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Scheduling Preferences</h4>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Prioritize Consecutive Classes</Label>
                      <p className="text-sm text-muted-foreground">Group related subjects together</p>
                    </div>
                    <Switch
                      checked={preferences.prioritizeConsecutiveClasses}
                      onCheckedChange={(checked) =>
                        setPreferences({ ...preferences, prioritizeConsecutiveClasses: checked })
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Avoid Back-to-Back Labs</Label>
                      <p className="text-sm text-muted-foreground">Prevent consecutive practical sessions</p>
                    </div>
                    <Switch
                      checked={preferences.avoidBackToBackLabs}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, avoidBackToBackLabs: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Prefer Morning Slots</Label>
                      <p className="text-sm text-muted-foreground">Schedule important subjects in morning</p>
                    </div>
                    <Switch
                      checked={preferences.preferMorningSlots}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, preferMorningSlots: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Balance Daily Load</Label>
                      <p className="text-sm text-muted-foreground">Distribute classes evenly across days</p>
                    </div>
                    <Switch
                      checked={preferences.balanceDailyLoad}
                      onCheckedChange={(checked) => setPreferences({ ...preferences, balanceDailyLoad: checked })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium">Time Constraints</h4>

                  <div className="space-y-2">
                    <Label>Maximum Gaps Per Day</Label>
                    <Input
                      type="number"
                      min="0"
                      max="5"
                      value={preferences.maxGapsPerDay}
                      onChange={(e) =>
                        setPreferences({ ...preferences, maxGapsPerDay: Number.parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred Start Time</Label>
                    <Input
                      type="time"
                      value={preferences.preferredStartTime}
                      onChange={(e) => setPreferences({ ...preferences, preferredStartTime: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Preferred End Time</Label>
                    <Input
                      type="time"
                      value={preferences.preferredEndTime}
                      onChange={(e) => setPreferences({ ...preferences, preferredEndTime: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Lunch Break Start</Label>
                    <Input
                      type="time"
                      value={preferences.lunchBreakStart}
                      onChange={(e) => setPreferences({ ...preferences, lunchBreakStart: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Lunch Break Duration (minutes)</Label>
                    <Input
                      type="number"
                      min="30"
                      max="120"
                      value={preferences.lunchBreakDuration}
                      onChange={(e) =>
                        setPreferences({ ...preferences, lunchBreakDuration: Number.parseInt(e.target.value) || 60 })
                      }
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Special Requirements</Label>
                <Textarea
                  placeholder="Enter any special scheduling requirements or notes..."
                  value={preferences.specialRequirements}
                  onChange={(e) => setPreferences({ ...preferences, specialRequirements: e.target.value })}
                />
              </div>
            </TabsContent>

            <TabsContent value="faculty" className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Faculty Constraints</h4>
                <Button onClick={addFacultyConstraint} size="sm">
                  👥 Add Faculty Constraint
                </Button>
              </div>

              <div className="space-y-4">
                {facultyConstraints.map((constraint, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Faculty Member</Label>
                          <Select
                            value={constraint.facultyId}
                            onValueChange={(value) => updateFacultyConstraint(index, "facultyId", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select faculty" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableFaculty.map((faculty) => (
                                <SelectItem key={faculty.id} value={faculty.id}>
                                  {faculty.name} - {faculty.department}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Max Consecutive Hours</Label>
                          <Input
                            type="number"
                            min="1"
                            max="6"
                            value={constraint.maxConsecutiveHours}
                            onChange={(e) =>
                              updateFacultyConstraint(
                                index,
                                "maxConsecutiveHours",
                                Number.parseInt(e.target.value) || 3,
                              )
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Max Daily Hours</Label>
                          <Input
                            type="number"
                            min="1"
                            max="8"
                            value={constraint.maxDailyHours}
                            onChange={(e) =>
                              updateFacultyConstraint(index, "maxDailyHours", Number.parseInt(e.target.value) || 6)
                            }
                          />
                        </div>

                        <div className="flex items-end md:col-span-2">
                          <Button variant="outline" size="sm" onClick={() => removeFacultyConstraint(index)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {facultyConstraints.length === 0 && (
                <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                  <div className="text-4xl mb-4">👥</div>
                  <p>No faculty constraints added yet. Click "Add Faculty Constraint" to get started.</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rooms" className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Room Constraints</h4>
                <Button onClick={addRoomConstraint} size="sm">
                  🏢 Add Room Constraint
                </Button>
              </div>

              <div className="space-y-4">
                {roomConstraints.map((constraint, index) => (
                  <Card key={index}>
                    <CardContent className="pt-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Room</Label>
                          <Select
                            value={constraint.roomId}
                            onValueChange={(value) => updateRoomConstraint(index, "roomId", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select room" />
                            </SelectTrigger>
                            <SelectContent>
                              {availableRooms.map((room) => (
                                <SelectItem key={room.id} value={room.id}>
                                  {room.name} - {room.type} (Capacity: {room.capacity})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>Capacity</Label>
                          <Input type="number" value={constraint.capacity} disabled className="bg-muted" />
                        </div>

                        <div className="flex items-end md:col-span-2">
                          <Button variant="outline" size="sm" onClick={() => removeRoomConstraint(index)}>
                            Remove
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {roomConstraints.length === 0 && (
                <div className="text-center py-8 text-gray-600 dark:text-gray-400">
                  <div className="text-4xl mb-4">🏢</div>
                  <p>No room constraints added yet. Click "Add Room Constraint" to get started.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="flex items-center gap-4 mt-6 pt-6 border-t">
            <Button
              onClick={handleGenerate}
              disabled={generationStatus.isGenerating || !selectedDepartment || !selectedSemester}
              className="flex-1"
              size="lg"
            >
              {generationStatus.isGenerating ? <>🔄 Generating Timetable...</> : <>⚡ Generate Optimized Timetable</>}
            </Button>
            {generationStatus.completed && (
              <Button variant="outline" onClick={handleReset}>
                Reset & Start Over
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Generation Progress */}
      {(generationStatus.isGenerating || generationStatus.completed) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {generationStatus.completed ? (
                <span className="text-green-600">✅</span>
              ) : generationStatus.error ? (
                <span className="text-red-600">⚠️</span>
              ) : (
                <span className="text-blue-600">🕐</span>
              )}
              Generation Status
            </CardTitle>
            <CardDescription>{generationStatus.currentStep}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{Math.round(generationStatus.progress)}%</span>
              </div>
              <Progress value={generationStatus.progress} className="w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Generation Options */}
      {selectedDepartment && selectedSemester && !generationStatus.isGenerating && (
        <GenerationOptions department={selectedDepartment} semester={selectedSemester} />
      )}

      {/* Generated Timetable */}
      {generatedTimetable && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">📅 Generated Timetable</CardTitle>
            <CardDescription>
              {selectedDepartment} - Semester {selectedSemester} | Generated on{" "}
              {new Date(generatedTimetable.generatedAt).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                  Pending Review
                </Badge>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  This timetable requires approval before implementation
                </span>
              </div>
              <TimetableView timetable={generatedTimetable} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
