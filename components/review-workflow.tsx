"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TimetableView } from "@/components/timetable-view"
import { ConflictAnalysis } from "@/components/conflict-analysis"
import { CheckCircle, XCircle, Clock, FileText, Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function ReviewWorkflow() {
  const [timetables, setTimetables] = useState([])
  const [selectedTimetable, setSelectedTimetable] = useState<any>(null)
  const [reviewComments, setReviewComments] = useState("")
  const [activeTab, setActiveTab] = useState("pending")
  const { toast } = useToast()

  useEffect(() => {
    // Load timetables from localStorage
    const stored = JSON.parse(localStorage.getItem("generatedTimetables") || "[]")
    setTimetables(stored)

    // If no timetables exist, create some mock data
    if (stored.length === 0) {
      const mockTimetables = [
        {
          id: "1",
          department: "Computer Science",
          semester: "5",
          generatedAt: new Date().toISOString(),
          status: "pending_review",
          schedule: generateMockSchedule(),
        },
        {
          id: "2",
          department: "Mathematics",
          semester: "3",
          generatedAt: new Date(Date.now() - 86400000).toISOString(),
          status: "approved",
          schedule: generateMockSchedule(),
          reviewedAt: new Date().toISOString(),
          reviewComments: "Approved with minor suggestions for next semester.",
        },
      ]
      localStorage.setItem("generatedTimetables", JSON.stringify(mockTimetables))
      setTimetables(mockTimetables)
    }
  }, [])

  const generateMockSchedule = () => {
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

    const schedule: any = {}
    days.forEach((day) => {
      schedule[day] = {}
      timeSlots.forEach((slot, index) => {
        if (index === 3) {
          schedule[day][slot] = {
            type: "break",
            subject: "Lunch Break",
            faculty: "",
            room: "",
            batch: "",
          }
        } else if (Math.random() > 0.3) {
          schedule[day][slot] = {
            type: "class",
            subject: "Sample Subject",
            code: "CS101",
            faculty: "Dr. Sample",
            room: "LH-101",
            batch: "CS-2024-A",
            subjectType: "theory",
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
    return schedule
  }

  const handleApprove = () => {
    if (!selectedTimetable) return

    const updatedTimetables = timetables.map((t: any) =>
      t.id === selectedTimetable.id
        ? {
            ...t,
            status: "approved",
            reviewedAt: new Date().toISOString(),
            reviewComments,
          }
        : t,
    )

    setTimetables(updatedTimetables)
    localStorage.setItem("generatedTimetables", JSON.stringify(updatedTimetables))

    toast({
      title: "Timetable Approved",
      description: `${selectedTimetable.department} Semester ${selectedTimetable.semester} timetable has been approved.`,
    })

    setSelectedTimetable(null)
    setReviewComments("")
  }

  const handleReject = () => {
    if (!selectedTimetable || !reviewComments.trim()) {
      toast({
        title: "Error",
        description: "Please provide comments for rejection.",
        variant: "destructive",
      })
      return
    }

    const updatedTimetables = timetables.map((t: any) =>
      t.id === selectedTimetable.id
        ? {
            ...t,
            status: "rejected",
            reviewedAt: new Date().toISOString(),
            reviewComments,
          }
        : t,
    )

    setTimetables(updatedTimetables)
    localStorage.setItem("generatedTimetables", JSON.stringify(updatedTimetables))

    toast({
      title: "Timetable Rejected",
      description: `${selectedTimetable.department} Semester ${selectedTimetable.semester} timetable has been rejected.`,
    })

    setSelectedTimetable(null)
    setReviewComments("")
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge className="bg-green-50 text-green-700 border-green-200">Approved</Badge>
      case "rejected":
        return <Badge className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>
      default:
        return <Badge className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending Review</Badge>
    }
  }

  const filteredTimetables = timetables.filter((t: any) => {
    switch (activeTab) {
      case "pending":
        return t.status === "pending_review"
      case "approved":
        return t.status === "approved"
      case "rejected":
        return t.status === "rejected"
      default:
        return true
    }
  })

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Review Workflow</h1>
        <p className="text-muted">Review and approve generated timetables</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timetable List */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Timetables
              </CardTitle>
              <CardDescription>Select a timetable to review</CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="pending">Pending</TabsTrigger>
                  <TabsTrigger value="approved">Approved</TabsTrigger>
                  <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab} className="mt-4">
                  <div className="space-y-3">
                    {filteredTimetables.map((timetable: any) => (
                      <div
                        key={timetable.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedTimetable?.id === timetable.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                        }`}
                        onClick={() => setSelectedTimetable(timetable)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="font-medium text-sm">{timetable.department}</div>
                          {getStatusIcon(timetable.status)}
                        </div>
                        <div className="text-xs text-muted mb-2">Semester {timetable.semester}</div>
                        <div className="flex items-center justify-between">
                          <div className="text-xs text-muted">
                            {new Date(timetable.generatedAt).toLocaleDateString()}
                          </div>
                          {getStatusBadge(timetable.status)}
                        </div>
                      </div>
                    ))}
                    {filteredTimetables.length === 0 && (
                      <div className="text-center py-8 text-muted">
                        <Calendar className="mx-auto h-8 w-8 mb-2 opacity-50" />
                        <p className="text-sm">No timetables in this category</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Review Panel */}
        <div className="lg:col-span-2">
          {selectedTimetable ? (
            <div className="space-y-6">
              {/* Timetable Header */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>
                      {selectedTimetable.department} - Semester {selectedTimetable.semester}
                    </span>
                    {getStatusBadge(selectedTimetable.status)}
                  </CardTitle>
                  <CardDescription>
                    Generated on {new Date(selectedTimetable.generatedAt).toLocaleString()}
                    {selectedTimetable.reviewedAt && (
                      <span className="ml-2">
                        • Reviewed on {new Date(selectedTimetable.reviewedAt).toLocaleString()}
                      </span>
                    )}
                  </CardDescription>
                </CardHeader>
              </Card>

              {/* Conflict Analysis */}
              <ConflictAnalysis timetable={selectedTimetable} />

              {/* Timetable View */}
              <Card>
                <CardHeader>
                  <CardTitle>Timetable Preview</CardTitle>
                  <CardDescription>Review the generated schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  <TimetableView timetable={selectedTimetable} />
                </CardContent>
              </Card>

              {/* Review Actions */}
              {selectedTimetable.status === "pending_review" && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review Actions</CardTitle>
                    <CardDescription>Approve or reject this timetable</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="comments">Review Comments</Label>
                      <Textarea
                        id="comments"
                        placeholder="Add your review comments here..."
                        value={reviewComments}
                        onChange={(e) => setReviewComments(e.target.value)}
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-4">
                      <Button onClick={handleApprove} className="flex-1">
                        <CheckCircle className="mr-2 h-4 w-4" />
                        Approve
                      </Button>
                      <Button variant="destructive" onClick={handleReject} className="flex-1">
                        <XCircle className="mr-2 h-4 w-4" />
                        Reject
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Previous Review Comments */}
              {selectedTimetable.reviewComments && (
                <Card>
                  <CardHeader>
                    <CardTitle>Review Comments</CardTitle>
                    <CardDescription>
                      Comments from {new Date(selectedTimetable.reviewedAt).toLocaleString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{selectedTimetable.reviewComments}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <Card>
              <CardContent className="flex items-center justify-center h-96">
                <div className="text-center">
                  <Calendar className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p className="text-muted">Select a timetable from the list to review</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
