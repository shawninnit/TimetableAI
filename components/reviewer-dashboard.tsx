"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"

export function ReviewerDashboard() {
  const [pendingReviews, setPendingReviews] = useState([])
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  })
  const router = useRouter()

  useEffect(() => {
    // Load pending timetables from localStorage
    const timetables = JSON.parse(localStorage.getItem("generatedTimetables") || "[]")
    const pending = timetables.filter((t: any) => t.status === "pending_review")
    const approved = timetables.filter((t: any) => t.status === "approved")
    const rejected = timetables.filter((t: any) => t.status === "rejected")

    setPendingReviews(pending)
    setStats({
      pending: pending.length,
      approved: approved.length,
      rejected: rejected.length,
      total: timetables.length,
    })
  }, [])

  const statCards = [
    {
      title: "Pending Reviews",
      value: stats.pending,
      description: "Awaiting your approval",
      icon: "⏰",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Approved",
      value: stats.approved,
      description: "Successfully approved",
      icon: "✅",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Rejected",
      value: stats.rejected,
      description: "Rejected for revision",
      icon: "❌",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
    {
      title: "Total Reviews",
      value: stats.total,
      description: "All time reviews",
      icon: "📄",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Reviewer Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">Review and approve generated timetables</p>
        </div>
        <Button onClick={() => router.push("/reviewer/review")}>
          <span className="mr-2">📄</span>
          Review Timetables
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <span className={`text-sm ${stat.color}`}>{stat.icon}</span>
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stat.value}</div>
              <p className="text-xs text-gray-600 dark:text-gray-400">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pending Reviews */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span>⚠️</span>
            Pending Reviews
          </CardTitle>
          <CardDescription>Timetables awaiting your review and approval</CardDescription>
        </CardHeader>
        <CardContent>
          {pendingReviews.length > 0 ? (
            <div className="space-y-4">
              {pendingReviews.slice(0, 5).map((timetable: any, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-yellow-50 rounded-lg">
                      <span className="text-yellow-600">📅</span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {timetable.department} - Semester {timetable.semester}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Generated on {new Date(timetable.generatedAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                      Pending Review
                    </Badge>
                    <Button size="sm" onClick={() => router.push("/reviewer/review")}>
                      Review
                    </Button>
                  </div>
                </div>
              ))}
              {pendingReviews.length > 5 && (
                <div className="text-center pt-4">
                  <Button variant="outline" onClick={() => router.push("/reviewer/review")}>
                    View All {pendingReviews.length} Pending Reviews
                  </Button>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-600 dark:text-gray-400">
              <div className="text-4xl mb-4 opacity-50">📄</div>
              <p>No pending reviews at the moment.</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Your recent review actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 rounded-full">
                <span className="text-green-600">✅</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Approved Computer Science Semester 3 timetable
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">2 hours ago</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-red-50 rounded-full">
                <span className="text-red-600">❌</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Rejected Mathematics Semester 5 timetable
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">1 day ago</div>
                <div className="text-xs text-red-600">Reason: Faculty workload imbalance</div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="p-2 bg-green-50 rounded-full">
                <span className="text-green-600">✅</span>
              </div>
              <div className="flex-1">
                <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  Approved Physics Semester 2 timetable
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">2 days ago</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
